const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = `import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
` + code;

code = code.replace(
  `<p className="text-sm font-serif mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderDescription() }} />`,
  `<div className="text-sm font-serif mb-4 leading-relaxed markdown-body">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {renderDescription()}
                </ReactMarkdown>
              </div>`
);

fs.writeFileSync('src/App.tsx', code);
