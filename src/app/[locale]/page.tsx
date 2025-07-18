import {getTranslations} from 'next-intl/server';
 
export default async function HomePage() {
  const t = await getTranslations('home');
  return <h1>{t('slogan')}</h1>;
}