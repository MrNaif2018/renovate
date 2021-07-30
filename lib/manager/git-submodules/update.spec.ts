import _simpleGit from 'simple-git';
import { dir } from 'tmp-promise';
import { join } from 'upath';
import { getName } from '../../../test/util';
import { setRepoGlobalConfig } from '../../config/global';
import type { RepoGlobalConfig } from '../../config/types';
import type { Upgrade } from '../types';
import updateDependency from './update';

jest.mock('simple-git');
const simpleGit: any = _simpleGit;

describe(getName(), () => {
  describe('updateDependency', () => {
    let upgrade: Upgrade;
    let repoGlobalConfig: RepoGlobalConfig;
    beforeAll(async () => {
      upgrade = { depName: 'renovate' };

      const tmpDir = await dir();
      repoGlobalConfig = { localDir: join(tmpDir.path) };
      setRepoGlobalConfig(repoGlobalConfig);
    });
    afterAll(() => {
      setRepoGlobalConfig();
    });
    it('returns null on error', async () => {
      simpleGit.mockReturnValue({
        submoduleUpdate() {
          throw new Error();
        },
      });
      const update = await updateDependency({
        fileContent: '',
        upgrade,
      });
      expect(update).toBeNull();
    });
    it('returns content on update', async () => {
      simpleGit.mockReturnValue({
        submoduleUpdate() {
          return Promise.resolve();
        },
        checkout() {
          return Promise.resolve();
        },
      });
      const update = await updateDependency({
        fileContent: '',
        upgrade,
      });
      expect(update).toEqual('');
    });
  });
});
