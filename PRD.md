# Product Requirements Document: Markdown Capture Application

## Product Vision and Purpose

The Markdown Capture application is a productivity tool designed for frictionless note-taking. It solves the problem of slow note capture by providing instant access to a text input overlay through a system-wide hotkey, enabling users to quickly capture thoughts without disrupting their workflow.

**Core Value Proposition**:
- Zero-friction note capture accessible from anywhere in the operating system
- Automatic file organization with intelligent naming
- Background operation with minimal resource usage
- No installation required - portable executable

## Functional Requirements

### 1. Global Hotkey System
**Requirement**: System-wide hotkey registration that works across all applications

**Features**:
- **Default Hotkey**: Ctrl+Shift+Space
- **User Configurability**: Support for different modifier combinations (Ctrl, Shift, Alt, Win)
- **Cross-Application Support**: Hotkey must work regardless of current focused application
- **Hotkey Testing**: Real-time validation of hotkey availability and functionality
- **Error Handling**: User-friendly error messages when hotkey registration fails

### 2. Overlay Window Interface
**Requirement**: Borderless overlay window for quick text input

**Features**:
- **Visual Design**: Semi-transparent overlay with rounded corners
- **Auto-Focus**: Window automatically focuses text input on display
- **Multi-line Support**: Support for multi-line text entry with Shift+Enter for new lines
- **Keyboard Shortcuts**:
  - Enter to save and close
  - Shift+Enter for new line
  - Escape to cancel without saving
- **Auto-Close**: Window closes when it loses focus
- **Window Behavior**: Hidden from Alt+Tab (tool window style)

### 3. System Tray Integration
**Requirement**: Background operation with system tray presence

**Features**:
- **Tray Icon**: Persistent icon in system tray
- **Context Menu**: Right-click menu with options:
  - Show Overlay (trigger capture)
  - Settings (open configuration)
  - Exit (quit application)
- **Balloon Notifications**: Success notifications when files are saved
- **Tooltip**: Application name and description on hover

### 4. Configuration Management
**Requirement**: User-configurable settings with persistence

**Features**:
- **Save Folder**: User-selectable directory for markdown file storage
- **Hotkey Configuration**: Customizable modifier keys and trigger key
- **Filename Template**: Customizable naming patterns with placeholder support
- **Configuration Persistence**: Settings saved across application restarts
- **Default Values**: Sensible defaults for first-time users
- **Validation**: Real-time validation of user inputs

### 5. File Management System
**Requirement**: Intelligent markdown file creation and organization

**Features**:
- **Template-Based Naming**: Support for date/time placeholders and title extraction
- **Placeholders Available**:
  - `{yyyy}` - Year (4 digits)
  - `{MM}` - Month (2 digits)
  - `{dd}` - Day (2 digits)
  - `{HH}` - Hour (24-hour format)
  - `{mm}` - Minute
  - `{ss}` - Second
  - `{title}` - First line of content (sanitized)
- **Title Extraction**: Automatic extraction from first non-empty line
- **Filename Sanitization**: Removal of invalid characters and length limits
- **UTF-8 Encoding**: Support for international characters
- **Default Template**: `{yyyy}-{MM}-{dd} {HHmm} {title}.md`

### 6. First Launch Experience
**Requirement**: Guided setup for new users

**Features**:
- **Folder Selection**: Automatic display of folder browser on first launch
- **Default Configuration**: Sensible defaults applied immediately
- **User Guidance**: Clear instructions for initial setup

### 7. Single Instance Enforcement
**Requirement**: Prevent multiple application instances

**Features**:
- **System Enforcement**: Prevents duplicate launches
- **Focus Handling**: Bring existing instance to front if launch attempted
- **Error Prevention**: Avoids hotkey conflicts and file access issues

## User Interaction Flows

### Primary Flow: Note Capture
1. **Trigger**: User presses global hotkey (Ctrl+Shift+Space)
2. **Display**: Overlay window appears centered on screen
3. **Input**: User types markdown content
4. **Save**: User presses Enter to save file
5. **Feedback**: Success notification appears in system tray
6. **Close**: Overlay window disappears

### Settings Configuration Flow
1. **Access**: Right-click system tray icon → Settings
2. **Modify**: User changes save folder, hotkey, or filename template
3. **Validate**: Real-time validation shows feedback
4. **Test**: Optional hotkey testing available
5. **Apply**: Changes saved automatically
6. **Restart**: Hotkey re-registered if changed

### Cancellation Flow
1. **Trigger**: User presses Escape or loses focus
2. **Close**: Overlay window closes without saving
3. **No Feedback**: No notification shown
4. **Return**: User returns to previous application

## Technical Requirements

### Service-Based Architecture
The application follows a service-oriented pattern with clear separation of concerns:

**Core Services Required**:
1. **Hotkey Service**: Global hotkey registration and event handling
2. **Tray Service**: System tray integration and notifications
3. **Storage Service**: Configuration persistence and logging
4. **Markdown Service**: File creation and content processing
5. **UI Service**: Overlay and settings window management

### Configuration System
**Data Model**:
```json
{
  "SaveFolder": "D:\\Notes",
  "HotkeyModifiers": 6,    // Bit flags: 1=Alt, 2=Ctrl, 4=Shift, 8=Win
  "HotkeyKey": 32,         // Virtual key code
  "FilenameTemplate": "{yyyy}-{MM}-{dd} {HHmm} {title}"
}
```

**Storage Requirements**:
- **Location**: User's AppData folder
- **Format**: JSON for easy editing and portability
- **Validation**: Path validation and write permission testing
- **Backward Compatibility**: Support for configuration upgrades

### Error Handling and Logging
**Logging Requirements**:
- **Daily Rotation**: Separate log files per day
- **Log Levels**: Info and Error channels
- **Structured Format**: Timestamps and categorization
- **User-Facing Messages**: Clear error messages with suggested actions

**Error Scenarios to Handle**:
- Hotkey registration failures
- File system permission issues
- Invalid configuration data
- Service initialization failures
- File save operation errors

## Platform Requirements

### System Requirements
**Minimum Requirements**:
- Windows 10 or Windows 11
- No administrator privileges required
- Standard user file system permissions

**Performance Requirements**:
- Minimal memory footprint
- Fast startup time (< 2 seconds)
- Instant hotkey response (< 100ms)
- Background operation with no CPU usage when idle

### Security and Validation Requirements

#### Input Validation
**Filename Sanitization**:
- Remove invalid characters: `< > : " | ? * \ /`
- Limit filename length (maximum 255 characters)
- Remove markdown heading syntax from title
- Fallback to timestamp if title extraction fails

**Path Validation**:
- Prevent directory traversal attacks
- Validate folder existence and write permissions
- Handle network paths and special locations

#### Security Considerations
**Data Protection**:
- No network access or external dependencies
- Local storage only - no cloud synchronization
- User data isolation to AppData folder
- No sensitive information in configuration files

## Architecture Requirements

### Service Interaction Patterns
The application follows an event-driven service architecture where services communicate through events rather than direct method calls:

**Event Flow**:
1. **Hotkey Service** fires hotkey pressed event
2. **Application Coordinator** responds by showing overlay
3. **Overlay Window** handles user input and saves via file service
4. **Tray Service** shows success notifications
5. **Storage Service** logs all operations and persists configuration

### Thread Safety Requirements
- **Hotkey Events**: Must marshal to UI thread for window operations
- **File Operations**: Async pattern to prevent UI blocking
- **Service State**: Proper synchronization for concurrent access
- **Window Management**: UI thread affinity for all window operations

## Open Questions

### Performance and Scalability
- Maximum file size supported for markdown content
- Performance with large numbers of files in save folder
- Memory usage patterns for extended operation

### User Experience
- Accessibility requirements for screen readers
- High DPI display support requirements
- Multi-monitor setup behavior

### Platform Considerations
- macOS/Linux feature equivalents for cross-platform rebuild
- Mobile platform considerations for similar functionality
- Web-based implementation requirements

### Extensibility
- Plugin architecture requirements for custom functionality
- Integration with external note-taking systems
- Template system expansion requirements

## Implementation Guidance

### Technology Stack Selection
When rebuilding with different technologies, ensure the stack can provide:

**Essential Capabilities**:
- System-wide hotkey registration (platform-specific APIs)
- Background process with system tray/notification area
- Borderless overlay window creation
- JSON configuration file management
- UTF-8 file I/O operations

**Recommended Technology Considerations**:
- **Electron/Tauri**: For cross-platform desktop apps with web technologies
- **Flutter Desktop**: For modern UI with cross-platform support
- **Swift + AppKit**: For macOS native implementation
- **Qt/C++**: For truly cross-platform native development
- **Web Technologies**: For cloud-based note-taking with browser hotkeys

### Critical Success Factors
1. **Hotkey Reliability**: Must work consistently across all applications
2. **Fast Response Time**: Overlay should appear instantly (< 100ms)
3. **Non-Intrusive Design**: Should not disrupt user workflow
4. **Robust Error Handling**: Graceful degradation when system APIs fail
5. **Configuration Portability**: Easy backup and migration of settings

This PRD provides a complete foundation for rebuilding the Markdown Capture application with any technology stack while preserving all core functionality and user experience characteristics.