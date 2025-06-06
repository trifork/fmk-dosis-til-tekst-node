import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../logger/logger';

export function findLatestModificationDate(...roots: string[]): Date | null {
    try {
        const files: string[] = [];

        for (let root of roots) {
            const stat = fs.statSync(root);
            if (stat.isDirectory()) {
                files.push(...getAllFilesInDirectory(root));
            } else if (stat.isFile()) {
                files.push(root);
            }
        }    

        if (files.length === 0) {
            return null;
        }

        const latestModificationDate = new Date(Math.max(...files.map(file => {
            const mtime = fs.statSync(file).mtimeMs
            return mtime;
        })));
        return latestModificationDate;
    } catch (err) {
        logger.error(err);
        return null;
    }
}

function getAllFilesInDirectory(dir: string): string[] {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const dirent of dirents) {
        const fullPath = path.join(dir, dirent.name);
        if (dirent.isDirectory()) {
            files.push(...getAllFilesInDirectory(fullPath));
        } else {
            files.push(path.join(dir, dirent.name));
        }
    }

    return files;
}

export function findParentContaining(currentPath: string, lookFor: string): string | null {
    const packageJsonPath = path.join(currentPath, lookFor);
  
    if (fs.existsSync(packageJsonPath)) {
      return currentPath;
    }
  
    const parentDirectory = path.dirname(currentPath);
  
    // Stop searching if we've reached the root directory
    if (parentDirectory === currentPath) {
      return null;
    }
  
    return findParentContaining(parentDirectory, lookFor);
  }
