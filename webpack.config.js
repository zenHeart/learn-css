const marked = require('marked');
const renderer = new marked.Renderer();
const path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        main: './index.js',
    },
    // Your post-compiled assets path.
    output: {
        path: path.join(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                    {
                        loader: 'markdown-loader',
                        options: {
                            pedantic: true,
                            renderer,
                        },
                    },
                ],
            },
        ],
    },
};
