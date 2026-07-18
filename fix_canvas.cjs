const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const overlayBtn = `      <div className="relative flex-1 min-h-[220px] max-h-[300px] md:max-h-[320px] bg-white flex items-center justify-center overflow-hidden">
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 px-2 text-xs border border-black hover:bg-black hover:text-white transition flex items-center justify-center gap-1.5 w-24 bg-white"
            title={isPlaying ? 'Pause simulation to drag coordinates manually' : 'Play physics simulation'}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                <span>Animate</span>
              </>
            )}
          </button>
        </div>
        <svg`;

code = code.replace(`      <div className="relative flex-1 min-h-[220px] max-h-[300px] md:max-h-[320px] bg-white flex items-center justify-center overflow-hidden">\n        <svg`, overlayBtn);
fs.writeFileSync('src/components/SystemDiagram.tsx', code);
