import { id as GH_RELEASES_DS } from '../datasource/github-releases';
import { id as GH_TAGS_DS } from '../datasource/github-tags';
import { GitlabPackagesDatasource } from '../datasource/gitlab-packages';
import { GitlabReleasesDatasource } from '../datasource/gitlab-releases';
import { id as GL_TAGS_DS } from '../datasource/gitlab-tags';
import { id as POD_DS } from '../datasource/pod';
import {
  GITHUB_API_USING_HOST_TYPES,
  GITLAB_API_USING_HOST_TYPES,
  PLATFORM_TYPE_GITHUB,
  PLATFORM_TYPE_GITLAB,
} from './platforms';

describe('constants/platform', () => {
  it('should be part of the GITLAB_API_USING_HOST_TYPES', () => {
    expect(GITLAB_API_USING_HOST_TYPES.includes(GL_TAGS_DS)).toBeTrue();
    expect(
      GITLAB_API_USING_HOST_TYPES.includes(GitlabReleasesDatasource.id)
    ).toBeTrue();
    expect(
      GITLAB_API_USING_HOST_TYPES.includes(GitlabPackagesDatasource.id)
    ).toBeTrue();
    expect(
      GITLAB_API_USING_HOST_TYPES.includes(PLATFORM_TYPE_GITLAB)
    ).toBeTrue();
  });

  it('should be not part of the GITLAB_API_USING_HOST_TYPES ', () => {
    expect(
      GITLAB_API_USING_HOST_TYPES.includes(PLATFORM_TYPE_GITHUB)
    ).toBeFalse();
  });

  it('should be part of the GITHUB_API_USING_HOST_TYPES ', () => {
    expect(GITHUB_API_USING_HOST_TYPES.includes(GH_TAGS_DS)).toBeTrue();
    expect(GITHUB_API_USING_HOST_TYPES.includes(GH_RELEASES_DS)).toBeTrue();
    expect(GITHUB_API_USING_HOST_TYPES.includes(POD_DS)).toBeTrue();
    expect(
      GITHUB_API_USING_HOST_TYPES.includes(PLATFORM_TYPE_GITHUB)
    ).toBeTrue();
  });

  it('should be not part of the GITHUB_API_USING_HOST_TYPES ', () => {
    expect(
      GITHUB_API_USING_HOST_TYPES.includes(PLATFORM_TYPE_GITLAB)
    ).toBeFalse();
  });
});
