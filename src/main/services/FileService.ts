import { promises as fs } from 'fs';
import path from 'path';
import { SettingsService } from './SettingsService';

export class FileService {
  private settingsService: SettingsService;

  constructor() {
    this.settingsService = SettingsService.getInstance();
  }

  async saveMarkdown(content: string, customFilename?: string): Promise<string> {
    const settings = await this.settingsService.getSettings();

    // Ensure save folder exists
    await this.ensureDirectoryExists(settings.saveFolder);

    // Generate filename
    const filename = customFilename || this.generateFilename(content, settings.filenameTemplate);
    const filePath = path.join(settings.saveFolder, filename);

    // Write file with UTF-8 encoding
    await fs.writeFile(filePath, content, 'utf8');

    console.log(`Saved markdown to ${filePath}`);
    return filename;
  }

  private generateFilename(content: string, template: string): string {
    const now = new Date();
    const title = this.extractTitle(content) || 'untitled';

    // Replace template placeholders
    let filename = template
      .replace(/{yyyy}/g, now.getFullYear().toString())
      .replace(/{MM}/g, (now.getMonth() + 1).toString().padStart(2, '0'))
      .replace(/{dd}/g, now.getDate().toString().padStart(2, '0'))
      .replace(/{HH}/g, now.getHours().toString().padStart(2, '0'))
      .replace(/{mm}/g, now.getMinutes().toString().padStart(2, '0'))
      .replace(/{ss}/g, now.getSeconds().toString().padStart(2, '0'))
      .replace(/{title}/g, this.sanitizeFilename(title));

    // Ensure .md extension
    if (!filename.endsWith('.md')) {
      filename += '.md';
    }

    return filename;
  }

  private extractTitle(content: string): string | null {
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Remove markdown heading syntax
      const title = trimmed.replace(/^#+\s*/, '');
      if (title) {
        return title;
      }
    }

    return null;
  }

  private sanitizeFilename(title: string): string {
    // Remove invalid characters
    const sanitized = title
      .replace(/[<>:"|?*\\/]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Limit length
    return sanitized.length > 50 ? sanitized.substring(0, 50) : sanitized;
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }
}