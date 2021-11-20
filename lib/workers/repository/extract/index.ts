import is from '@sindresorhus/is';
import { getManagerConfig, mergeChildConfig } from '../../../config';
import type { RenovateConfig } from '../../../config/types';
import { logger } from '../../../logger';
import { getManagerList } from '../../../manager';
import type { PackageFile } from '../../../manager/types';
import { getFileList } from '../../../util/git';
import { regEx } from '../../../util/regex';
import { getMatchingFiles } from './file-match';
import { getManagerPackageFiles } from './manager-files';

export async function extractAllDependencies(
  config: RenovateConfig
): Promise<Record<string, PackageFile[]>> {
  let managerList = getManagerList();
  if (is.nonEmptyArray(config.enabledManagers)) {
    logger.debug('Applying enabledManagers filtering');
    managerList = managerList.filter((manager) =>
      config.enabledManagers.includes(manager)
    );
  }
  const extractList: RenovateConfig[] = [];
  const fileList = await getFileList();

  const tryConfig = (extractConfig: RenovateConfig): void => {
    const matchingFileList = getMatchingFiles(extractConfig, fileList);
    if (matchingFileList.length) {
      for (const patternGroup of extractConfig.transformationRegex) {
        const groups = {};
        for (const file of matchingFileList) {
          // apply sed-like regex transformation
          const pattern = regEx(patternGroup.find);
          const replaced = file.replace(pattern, patternGroup.replace);
          if (!(replaced in groups)) {
            groups[replaced] = [];
          }
          groups[replaced].push(file);
        }
        logger.debug(`Groups:`);
        logger.debug(groups);
        for (const [outFile, inFiles] of Object.entries(groups)) {
          extractList.push({
            ...extractConfig,
            fileList: [outFile],
            fileMeta: { inFiles },
          });
          extractList.push({
            ...extractConfig,
            manager: 'pip_requirements',
            fileList: inFiles,
            fileMeta: { outFile },
          });
        }
      }
    }
  };

  for (const manager of managerList) {
    const managerConfig = getManagerConfig(config, manager);
    managerConfig.manager = manager;
    if (manager === 'regex') {
      for (const regexManager of config.regexManagers) {
        tryConfig(mergeChildConfig(managerConfig, regexManager));
      }
    } else {
      tryConfig(managerConfig);
    }
  }

  const extractResults = await Promise.all(
    extractList.map(async (managerConfig) => {
      const packageFiles = await getManagerPackageFiles(managerConfig);
      return { manager: managerConfig.manager, packageFiles };
    })
  );
  const extractions: Record<string, PackageFile[]> = {};
  let fileCount = 0;
  for (const { manager, packageFiles } of extractResults) {
    if (packageFiles?.length) {
      fileCount += packageFiles.length;
      logger.debug(`Found ${manager} package files`);
      extractions[manager] = (extractions[manager] || []).concat(packageFiles);
    }
  }
  logger.debug(`Found ${fileCount} package file(s)`);
  return extractions;
}
