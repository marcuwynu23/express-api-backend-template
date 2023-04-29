const path = require('path');

module.exports = {
	mode: 'production',
	entry: './bin/www',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	target: 'node',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	}
};

