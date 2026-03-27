---
sidebar_position: 10
---

# Translation Model

### Introduction 

For language translation, the system uses Meta's open-source No Language Left Behind (NLLB) model, specifically the 600M parameter distilled version. NLLB supports translation across 200 languages, with particular strength in low-resource languages, making it well-suited for African language contexts such as Swahili. Model inference is done locally without the need for any external API calls. 


### Model Architecture

Both the model and tokeniser are loaded locally using Hugging Face's transformers library, configured with NLLB's internal language codes (eng_Latn for English, swh_Latn for Swahili). The tokeniser converts raw source text into token IDs, which are fed into the model. The model then outputs a sequence of token IDs in the target language, which the tokeniser decodes back into human-readable Swahili text.

The NLLB model is a sequence-to-sequence (seq2seq) transformer model consisting of two components. The encoder reads the source token IDs and, through self-attention, produces a matrix of hidden states that captures the meaning of the entire input sentence. The decoder then autoregressively generates the target language sequence one token at a time, using cross-attention to attend to the encoder's hidden state matrix at each step, allowing it to focus on the most relevant parts of the source sentence as it builds the translation.

At each decoding step, the decoder passes its internal hidden state, which is a summary of both the encoder's output and the tokens generated so far, through a series of learned weight matrices. These weight matrices project the hidden state into a probability distribution over the entire vocabulary, from which the highest-probability token is selected and appended to the output sequence. This continues until an end-of-sequence token is produced. These weight matrices are learned during pre-training across 200 languages and are what encode the model's translation knowledge. 

```python
model = AutoModelForSeq2SeqLM.from_pretrained(
    "facebook/nllb-200-distilled-600M",
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto" if torch.cuda.is_available() else None
)

tokenizer = AutoTokenizer.from_pretrained(
    "facebook/nllb-200-distilled-600M",
    src_lang="eng_Latn",
    tgt_lang="swh_Latn"
)
inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=max_length)

# Move to same device as model
if torch.cuda.is_available():
    inputs = {k: v.cuda() for k, v in inputs.items()}

# Generate translation
with torch.no_grad():
    outputs = model.generate(
        **inputs,
        max_length=max_length,
        num_beams=5,
        early_stopping=True,
        forced_bos_token_id=tokenizer.convert_tokens_to_ids("swh_Latn")
    )

# Decode output
translation = tokenizer.decode(outputs[0], skip_special_tokens=True)
```

### Low Rank Adaptation (LoRA) fine-tuning

The pre-trained weight matrices are general — trained across 200 languages — which limits translation quality for a specific pair like English to Swahili. To address this, the model is fine-tuned using LoRA (Low-Rank Adaptation), a parameter-efficient method that adapts the model without retraining its full weight matrices.

The mathematical intuition behind LoRA is straightforward. Each weight matrix $W$ in the model has dimensions $d \times k$. Full fine-tuning would update every value in $W$ directly, which is computationally expensive. The key insight behind LoRA is that the adjustment needed to adapt a pre-trained model lies in a **low-rank subspace**, meaning it can be approximated by two much smaller matrices:

$$\Delta W = A \times B$$

where $A$ is $d \times r$, $B$ is $r \times k$, and $r$ is a small rank value such as 4 or 8. Only $A$ and $B$ are trained, dramatically reducing the number of trainable parameters.

The LoRA adaptors are trained on a dataset of English-Swahili sentence pairs. During training, the frozen weights of the NLLB model produces a predicted Swahili translation, which is compared against the correct translation using a loss function. The resulting gradient is propagated back via backpropagation, updating only $A$ and $B$ while $W$ remains frozen. Over many training steps, $A$ and $B$ converge to produce a $\Delta W$ that corrects the model's outputs toward accurate English-Swahili translations.

Once trained, the adaptor matrices are injected back into the model by adding $\Delta W = A \times B$ directly to the corresponding frozen weight matrix, giving an effective weight of $W' = W + A \times B$. This means no additional inference overhead is introduced, the adaptation is absorbed into the existing weight matrices and the model runs exactly as before, just with improved English-Swahili translation quality.

**Dataset**:
The training data was sourced from the Hugging Face dataset Rogendo/English-Swahili-Sentence-Pairs, which contains 200,000 English-Swahili sentence pairs. The dataset was split using a 95/5 train-evaluation split.

**Configuration**:
LoRA was configured using the `peft` library's `LoraConfig`, with rank `r=16` and `lora_alpha = 32`. The adaptors were injected into the attention weight matrices of the transformer, specifically `q_proj`, `k_proj`, `v_proj`, and `out_proj`, which are the primary learned projections through which attention is computed. This gave the adaptors direct influence over how the model attends to source tokens during decoding.

**Preprocessing**:
Each batch of sentence pairs was preprocessed using the NLLB tokeniser, which converts the English source text and Swahili target text into token IDs with a maximum sequence length of 128 tokens. The preprocessed datasets replaced the raw text columns with input_ids and labels ready for training.

**Training**:
The model was trained for 3 epochs using the Hugging Face Seq2SeqTrainer, with a batch size of 8, learning rate of $1×10^−3$ and a warmup of 100 steps. A `DataCollatorForSeq2Seq` handled dynamic padding across batches. Evaluation was run at the end of each epoch, with the final average evaluation loss coming in around 0.2, indicating the LoRA adaptors had successfully learned to improve English-Swahili translation quality. 

```python
ds = load_dataset("Rogendo/English-Swahili-Sentence-Pairs")

ds_split = ds["train"].train_test_split(test_size=0.05, seed=42)
train_dataset = ds_split["train"]
eval_dataset = ds_split["test"]
MODEL_ID = "facebook/nllb-200-distilled-600M"
tokenizer = NllbTokenizerFast.from_pretrained(MODEL_ID, src_lang="eng_Latn", tgt_lang="swh_Latn")
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_ID)

lora_config = LoraConfig(
    task_type=TaskType.SEQ_2_SEQ_LM,
    r=16,  # Increased from 8 for more capacity
    lora_alpha=32,
    lora_dropout=0.05,  # Reduced from 0.1
    target_modules=["q_proj", "v_proj", "k_proj", "out_proj"],  # More modules
    bias="none"
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

def preprocess(batch):
    # Filter out any None values and ensure strings
    english_texts = [str(text) if text is not None else "" for text in batch['English sentence']]
    swahili_texts = [str(text) if text is not None else "" for text in batch['Swahili Translation']]

    model_inputs = tokenizer(
        english_texts,
        text_target=swahili_texts,
        max_length=128,
        truncation=True
    )
    
    return model_inputs

train_dataset = train_dataset.map(preprocess, batched=True, remove_columns=train_dataset.column_names)
eval_dataset = eval_dataset.map(preprocess, batched=True, remove_columns=eval_dataset.column_names)

training_args = Seq2SeqTrainingArguments(
    output_dir="./lora_en_sw_v3",  # New directory
    per_device_train_batch_size=8,  # Increased like the GitHub example
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    learning_rate=1e-3,  # Much higher LR like the example
    logging_steps=50,
    save_strategy="steps",
    save_steps=1000,
    save_total_limit=3, 
    eval_strategy="epoch",
    warmup_steps=100,
    weight_decay=0.01,  # Add back weight decay
    push_to_hub=False
)

data_collator = DataCollatorForSeq2Seq(
    tokenizer=tokenizer,
    model=model
)

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    data_collator=data_collator,
)

# Start fresh training
trainer.train()

print("Finished training")

model.save_pretrained("./lora_en_sw_v3")
tokenizer.save_pretrained("./lora_en_sw_v3")

```

Once training was complete, the LoRA adaptor weights were merged back into the base NLLB model using `merge_and_unload()`. This computes $W' = W + A \times B$ for each target weight matrix, absorbing the adaptor corrections directly into the base weights and producing a single standalone model with no dependency on the PEFT library at inference time.

The merged model and tokeniser were then pushed to the Hugging Face Hub under `BigBouncyBoii/lora-en-sw-dignitas`, making the fine-tuned model available for loading directly in the production system without requiring the LoRA adaptors to be applied separately at runtime.

```python
def merge_lora_model(
    base_model_name="facebook/nllb-200-distilled-600M",
    lora_model_name="BigBouncyBoii/lora-en-sw-dignitas",
    output_dir="dignitas-en-sw-model",
    push_to_hub=False,
    hub_model_name=None
):
    base_model = AutoModelForSeq2SeqLM.from_pretrained(
        base_model_name,
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        device_map="auto" if torch.cuda.is_available() else None
    )
    model = PeftModel.from_pretrained(base_model, lora_model_name)

    merged_model = model.merge_and_unload()

    tokenizer = AutoTokenizer.from_pretrained(lora_model_name)
    
    os.makedirs(output_dir, exist_ok=True)
    merged_model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
  
    return merged_model, tokenizer
```

### ONNX 8-bit quantization

Running the model on a CPU in a cloud environment introduces latency concerns, as transformer models are computationally intensive. To address this, the model was converted to ONNX (Open Neural Network Exchange) format. ONNX defines an extensible computation graph model, along with built-in operators and standard data types that allows models trained in frameworks like PyTorch to be exported into a framework-agnostic graph format. The ONNX Runtime then executes this graph with platform-specific optimisations. These include optimisations such as operator fusion which is combining multiple operations into one and selecting the most efficient backend for the hardware available. All of this contributes to a reduction in inference latency without changing the model's outputs.

To further reduce memory requirements, the model was quantised to 8-bit precision. By default, neural network weights are stored as 32-bit floating point values (float32), where each weight occupies 4 bytes. Quantisation reduces this to 8-bit integers (int8), cutting RAM memory usage because loading model weights require less space and improving inference speed because integer arithmetic is cheaper than floating point on CPU-only hardware. The quantisation method used is dynamic quantisation, which requires no training data or calibration dataset. Weight matrices are quantised statically at export time, while scale factors for mapping floating point numbers to integers for activations are computed dynamically at inference runtime. Dynamic quantisation means that collecting calibration is not needed.

To convert the model, the model is exported to ONNX fp32. The merged fine-tuned Hugging Face model is loaded and exported to ONNX format using `ORTModelForSeq2SeqLM`.This produces three separate ONNX components, `encoder_model.onnx`, `decoder_model.onnx`, and `decoder_with_past_model.onnx`,, reflecting the seq2seq architecture's distinct inference stages. After that, each of the three ONNX components is quantised independently using `ORTQuantizer` with an `avx512_vnni` quantisation config of `is_static=False`. AVX-512 VNNI is a CPU instruction set and the config targets these instructions specifically for maximum CPU inference throughput. Finally, tokeniser and config files are copied across to the output directory, and the temporary FP32 files are deleted to free up disk space. Finally, the quantised ONNX model is pushed to the Hugging Face Hub under `BigBouncyBoii/lora-en-sw-dignitas-onnx` for loading in the production system.

```python
def convert_model_to_onnx_int8(model_id, output_path):

    fp32_path = output_path + "_fp32_tmp"
    # Step 1: Export to ONNX FP32
    model = ORTModelForSeq2SeqLM.from_pretrained(
        model_id,
        export=True,
    )
    tokenizer = AutoTokenizer.from_pretrained(model_id)

    model.save_pretrained(fp32_path)
    tokenizer.save_pretrained(fp32_path)

    del model
    gc.collect()

    # Set up quantization config for AVX-512 VNNI with dynamic quantisation
    qconfig = AutoQuantizationConfig.avx512_vnni(is_static=False, per_channel=False)

    os.makedirs(output_path, exist_ok=True)

    # Quantize each ONNX component (encoder, decoder, decoder_with_past)
    for onnx_file in ["encoder_model.onnx", "decoder_model.onnx", "decoder_with_past_model.onnx"]:
        src = os.path.join(fp32_path, onnx_file)
        if not os.path.exists(src):
            continue
        quantizer = ORTQuantizer.from_pretrained(fp32_path, file_name=onnx_file)
        quantizer.quantize(
            save_dir=output_path,
            quantization_config=qconfig,
        )

    # Copy tokenizer and config files
    for fname in os.listdir(fp32_path):
        if not fname.endswith(".onnx"):
            shutil.copy2(os.path.join(fp32_path, fname), os.path.join(output_path, fname))
```

### OpenVino 8-bit quantization

OpenVINO was tested as an alternative to ONNX, but was not selected for production as OpenVINO optimises specifically for Intel hardware, and the underlying CPU architecture of the Azure deployment environment is unknown. The conversion process is simpler than ONNX,  `OVModelForSeq2SeqLM.from_pretrained()` handles the full export in a single call, with `load_in_8bit=True` enabling INT8 weight compression directly at export time. Unlike the ONNX pipeline which quantises each encoder and decoder component separately, OpenVINO handles this internally. Weights are compressed to INT8 while activations remain in FP16, balancing memory reduction with inference accuracy.

```python
def convert_model_to_int8(model_id, output_path):
    
    try:
        
        model = OVModelForSeq2SeqLM.from_pretrained(
            model_id,
            export=True,
            compile=False,
            load_in_8bit=True,  # Enable 8-bit weight compression
            cache_dir="./model_cache",
            device_map=None  # Load to CPU to avoid device memory issues
        )
        
        tokenizer = AutoTokenizer.from_pretrained(model_id)
        
        # Save the compressed model
        print("Step 3/3: Saving INT8 compressed model and tokenizer...")
        model.save_pretrained(output_path)
        tokenizer.save_pretrained(output_path)

        # Clean up memory
        del model
        del tokenizer
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

    except Exception as e:
        # Clean up failed conversion artifacts
        if os.path.exists(output_path):
            shutil.rmtree(output_path)
        raise Exception("Failed to convert model to INT8. See logs for details.")
```

### Translation Service

At production time, the fine-tuned ONNX INT8 model is loaded from Hugging Face into a TranslationService class, which initialises the model and tokeniser and exposes english_to_swahili() and swahili_to_english() methods. Each translation call sets the appropriate source language code on the tokeniser, tokenises the input, runs model.generate() autoregressively with the target language token forced as the start of the output sequence, and decodes the result back to text.

```python
HF_MODEL_ID_OPENVINO = "BigBouncyBoii/dignitas-en-sw-openvino-i8"
HF_MODEL_ID_ONNX = "BigBouncyBoii/dignitas-en-sw-onnx-i8"

ENGLISH_CODE = "eng_Latn"
SWAHILI_CODE = "swh_Latn"

class TranslationService:
    def __init__(self, model_type="onnx"):
        if model_type == "onnx":
            print(f"Loading ONNX model from {HF_MODEL_ID_ONNX}...")
            self.model = ORTModelForSeq2SeqLM.from_pretrained(
                HF_MODEL_ID_ONNX,
                encoder_file_name="encoder_model_quantized.onnx",
                decoder_file_name="decoder_model_quantized.onnx",
                decoder_with_past_file_name="decoder_with_past_model_quantized.onnx",
            )
            self.tokenizer = AutoTokenizer.from_pretrained(HF_MODEL_ID_ONNX)
        else:
            print(f"Loading OpenVINO model from {HF_MODEL_ID_OPENVINO}...")
            self.model = OVModelForSeq2SeqLM.from_pretrained(HF_MODEL_ID_OPENVINO)
            self.tokenizer = AutoTokenizer.from_pretrained(HF_MODEL_ID_OPENVINO)

    def english_to_swahili(self, text):
        def _translate(t):
            self.tokenizer.src_lang = ENGLISH_CODE
            inputs = self.tokenizer(t, return_tensors="pt")
            outputs = self.model.generate(
                **inputs,
                forced_bos_token_id=self.tokenizer.convert_tokens_to_ids(SWAHILI_CODE),
                max_length=512
            )
            return self.tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
        return translate_markdown(text, _translate)
    
    def swahili_to_english(self, text):
        self.tokenizer.src_lang = SWAHILI_CODE
        inputs = self.tokenizer(text, return_tensors="pt")
        
        # Generate translation using the OpenVINO model
        outputs = self.model.generate(
            **inputs,
            forced_bos_token_id=self.tokenizer.convert_tokens_to_ids(ENGLISH_CODE),
            max_length=512
        )
        return self.tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
```