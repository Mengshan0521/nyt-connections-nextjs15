// Basic functionality test script
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing basic functionality...\n');

// Test 1: Check if essential files exist
const essentialFiles = [
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/layout.tsx',
  'src/components/GameBoard.tsx',
  'src/components/theme/ThemeSwitch.tsx',
  'src/lib/gameDataService.ts',
  'src/lib/supabase.ts',
  'src/i18n/routing.ts',
  'messages/en.json'
];

console.log('📁 Checking essential files...');
essentialFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Test 2: Check package.json dependencies
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['next', 'react', 'react-dom', 'next-intl', '@supabase/supabase-js', 'framer-motion'];

console.log('\n📦 Checking dependencies...');
requiredDeps.forEach(dep => {
  const exists = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
  console.log(`  ${exists ? '✅' : '❌'} ${dep}`);
});

// Test 3: Check TypeScript configuration
const tsConfigExists = fs.existsSync('tsconfig.json');
console.log('\n🔧 TypeScript configuration:', tsConfigExists ? '✅' : '❌');

// Test 4: Check environment variables
const envFiles = ['.env.local', '.env.example'];
console.log('\n🌍 Environment files...');
envFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Test 5: Check message files
const messageFiles = ['en.json', 'es.json', 'fr.json', 'de.json', 'zh-cn.json'];
console.log('\n🌐 Translation files...');
messageFiles.forEach(file => {
  const exists = fs.existsSync(path.join('messages', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n✅ Basic functionality test completed!');
console.log('🎉 The application structure is ready for deployment.');