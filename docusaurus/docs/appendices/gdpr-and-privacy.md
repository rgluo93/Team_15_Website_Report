---
sidebar_position: 2
---

# GDPR and Privacy

:::info
This page reflects controls currently implemented in the LeadNow codebase as of March 26, 2026.
It is not legal advice.
:::


## 1. Scope

This page explains how Dignitas, the data controller, handles personal data for platform operations, AI-assisted features, and security monitoring, and how that aligns with GDPR principles.

## 2. Personal Data Processed

LeadNow may process:

- Account and identity data (name, email, phone, role, tenant/school context)
- Education/workflow data (learning activity, module completion, comments, staff workflows)
- Communication data (messages and notifications metadata)
- Technical/security data (session data, logs, audit records, IP/device metadata where captured)
- AI interaction data (chat prompts/history context in AI services)

## 3. Purposes and Legal Bases

| Purpose | Legal Basis |
|---|---|
| Provide platform services and authentication | Contract (GDPR Art. 6(1)(b)) |
| Tenant/school operations and reporting | Contract / Legitimate interests |
| Security, logging, and abuse prevention | Legitimate interests (Art. 6(1)(f)) |
| Compliance and legal response obligations | Legal obligation (Art. 6(1)(c)) |
| Optional non-essential communications (if enabled) | Consent (Art. 6(1)(a)) |

## 4. Implemented Retention and Privacy Controls

This section describes controls that are **implemented in code/configuration**.

### 4.1 Activity Log Retention

LeadNow configures an activity log retention window.

- Config: `config/activitylog.php`
- Setting: `delete_records_older_than_days = 15`

Activity records older than 15 days are configured to be removed by the activity log cleanup process when scheduled cleanup is running in deployment.

### 4.2 Application Log File Retention

LeadNow configures daily log rotation retention.

- Config: `config/logging.php`
- Setting: `days = env('LOG_DAILY_DAYS', 14)`

By default, daily log files are kept for 14 days unless overridden by environment configuration.

### 4.3 Scheduled and Command-Based Cleanup

LeadNow uses Laravel 11 scheduling and includes a custom cleanup command.

- Scheduling entrypoint: `bootstrap/app.php` (`withSchedule(...)`)
- Cleanup command: `app/Console/Commands/ClearLogs.php`
- Command behavior: removes old log files (current command logic uses a 5-day threshold)

### 4.4 Session Expiration

Session timeout is configured.

- Config: `config/session.php`
- Setting: `lifetime = env('SESSION_LIFETIME', 120)`

This controls session expiration after inactivity (minutes).  
It does not by itself define full-table retention/deletion for all personal data categories.

### 4.5 AI Chat History TTL (Redis)

AI chat history is configured as short-lived in Redis.

- `ai_resource/llm_service/chat_service.py` (default `ttl_seconds = 180`)
- `ai_resource/llm_service/redis_history.py` (TTL set/refreshed on operations)

This provides ephemeral retention for Redis-based chat history contexts.

### 4.6 Soft Deletes in Domain Models

The following domain models use soft delete behavior.

- Example: `app/Models/LeadnowDocument.php`
- Example: `app/Models/ReflectiveJournalComment.php`

## 5. Transparency on Current Limits

- Not all business tables currently have explicit time-based purge jobs.
- Some retention controls are configuration-based and depend on scheduled jobs/operations being correctly enabled in deployment.

## 6. International Transfers and Processors

LeadNow may rely on third-party infrastructure and AI-related services. If personal data is transferred internationally, appropriate safeguards (including SCCs where required) will be applied and documented contractually.

## 7. Security Measures

Current controls include:

- Role/permission-based access controls
- Session timeout controls
- Log retention and cleanup controls
- Audit/activity logging controls
- Short-lived AI chat history in Redis (TTL)
- Standard transport/storage security measures per environment baseline

## 8. User Responsibility

LeadNow AI features are assistive and may produce incorrect or incomplete output.  
Users and administrators should review outputs before relying on them in educational or operational decisions.

## 9. Cookies and Similar Technologies

LeadNow uses session and caching mechanisms necessary for authentication and platform operation.  

---

## Appendix: Internal Implementation References

- `config/activitylog.php`
- `config/logging.php`
- `bootstrap/app.php`
- `app/Console/Commands/ClearLogs.php`
- `config/session.php`
- `ai_resource/llm_service/chat_service.py`
- `ai_resource/llm_service/redis_history.py`
- `app/Models/LeadnowDocument.php`
- `app/Models/ReflectiveJournalComment.php`