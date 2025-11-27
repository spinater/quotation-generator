# Agent-Generated Markdown Organization Setup

**Created**: 2025-01-18 14:32:00  
**Type**: System Documentation  
**Status**: Completed  
**Related Files**: `.github/copilot-instructions.md`, `.github/agent-md/README.md`

---

## Overview

This document records the setup and organization of the agent-generated markdown documentation system for the Thai Quotation & Receipt Generator project.

## Purpose

To establish a structured, timestamped documentation system for AI agent-generated technical documentation, research findings, and analysis reports.

## Implementation Details

### 1. Directory Structure Created

```
.github/agent-md/
├── README.md                    # Index of all agent-generated documents
├── archive/                     # Archive directory for old documents (6+ months)
└── YYYY-MM-DD-HHmmss-*.md      # Timestamped documentation files
```

### 2. Naming Convention Established

**Format**: `YYYY-MM-DD-HHmmss-descriptive-name.md`

**Components**:
- `YYYY-MM-DD`: Date of creation (ISO 8601 format)
- `HHmmss`: Time of creation (24-hour format, no separators)
- `descriptive-name`: Kebab-case description of content

**Examples**:
- `2025-01-18-143200-agent-md-organization-setup.md` (this file)
- `2025-01-18-150533-invoice-pdf-styling-analysis.md`
- `2025-01-19-091045-database-migration-strategy.md`

### 3. Copilot Instructions Updated

Added **Section 17: Agent-Generated Markdown File Management** to `.github/copilot-instructions.md`:

- Mandatory rules for agent-generated documentation
- Directory structure guidelines
- When to use agent-generated docs
- Naming format specifications
- Cleanup and archiving guidelines
- Integration with task files

### 4. Index File Created

Created `.github/agent-md/README.md` with:
- Purpose and overview
- Naming convention documentation
- Current documents table (empty initially)
- Usage guidelines (when to create, when not to create)
- Relationship with task files
- Maintenance and archiving policies

### 5. Quick Reference Card Updated

Updated the Quick Reference Card in copilot-instructions.md to include:
```
📝 AGENT DOCS: .github/agent-md/ (YYYY-MM-DD-HHmmss-name.md format)
📋 TASK FILES: .github/tasks/ (track implementation progress)
```

## Usage Guidelines

### When to Create Agent-Generated Docs

✅ **DO create** for:
- API analysis and specifications
- Technical research findings
- Architecture decisions and rationale
- Code analysis and reviews
- Testing strategies and results
- Database schema changes
- Performance optimization investigations
- Security analysis
- Complex feature implementation guides

❌ **DON'T create** for:
- Simple bug fixes (use commit messages)
- Routine updates (use git history)
- Work-in-progress notes (use task files)
- Temporary debugging logs

### Workflow Integration

```
1. Research/Analysis Phase
   ↓
   Create agent-md document (timestamped)
   ↓
2. Planning Phase
   ↓
   Create task file referencing agent doc
   ↓
3. Implementation Phase
   ↓
   Update task file with progress
   ↓
4. Completion
   ↓
   Mark task complete, keep agent doc for reference
```

## Benefits

1. **Historical Tracking**: Timestamp-based naming preserves chronological order
2. **Knowledge Preservation**: Technical decisions and research remain documented
3. **Searchability**: Descriptive names make finding relevant docs easy
4. **Organization**: Separate from task files but integrated workflow
5. **Maintainability**: Clear archiving policy prevents clutter
6. **Traceability**: Links between analysis (agent-md) and implementation (tasks)

## Maintenance Policy

### Archiving Rules
- Move documents older than 6 months to `archive/` subdirectory
- Update README.md index when archiving
- Keep frequently referenced docs in main directory regardless of age
- Maintain archive summary in README.md

### Index Updates
- Add new documents to README.md upon creation
- Include: timestamp, filename, brief purpose
- Organize by date (newest first)
- Update "Last Updated" and counts

## Example Workflow

### Scenario: Invoice PDF Styling Enhancement

1. **Agent analyzes thread about invoice PDF work**:
   - Creates: `2025-01-18-150000-invoice-pdf-styling-analysis.md`
   - Documents: VAT logic, withholding tax, signature support, calculations

2. **Create implementation task**:
   - Creates: `.github/tasks/task-2025-01-18-invoice-pdf-enhancements.md`
   - References: Link to agent-md doc for technical details
   - Includes: Checklist, requirements, progress tracking

3. **Implementation**:
   - Update task file as work progresses
   - Agent-md doc remains unchanged (historical reference)

4. **Completion**:
   - Mark task as completed
   - Agent-md doc preserved for future reference
   - Update README.md index

## Related Documentation

- **Task Management**: `.github/tasks/` - Implementation tracking
- **Memory System**: `.github/memory/` - Knowledge graphs and observations
- **Copilot Instructions**: `.github/copilot-instructions.md` - Development guidelines
- **API Documentation**: `./docs/` - API specifications

## Next Steps

1. Update README.md index when new agent-md documents are created
2. Reference this document when creating future agent-generated docs
3. Follow naming convention strictly for all new documents
4. Establish archiving workflow after 6 months

## Notes

- This is the first document in the agent-md system
- Timestamp: 2025-01-18 14:32:00 (used for filename)
- Created as part of organizing documentation from invoice PDF enhancement thread
- System ready for production use

---

**File Status**: Complete  
**Location**: `.github/agent-md/2025-01-18-143200-agent-md-organization-setup.md`  
**Referenced By**: None (initial document)