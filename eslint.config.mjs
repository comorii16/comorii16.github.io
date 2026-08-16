import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const eslintConfig = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'] },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      // static export + images.unoptimized 환경이라 next/image 의 이점이 없다.
      // 이미지 경로는 site.config 의 withBasePath() 로 일괄 처리한다.
      '@next/next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
