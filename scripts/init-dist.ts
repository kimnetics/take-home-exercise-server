import shell from 'shelljs'

const { rm, mkdir, cp } = shell

rm('-rf', './dist')
mkdir('-p', './dist/models')
cp('./src/config.cjs', './dist')
cp('./newrelic.cjs', './dist')
cp('./{package.json,package-lock.json}', './dist')
cp('-r', './config', './dist')
cp('-r', './public', './dist')
