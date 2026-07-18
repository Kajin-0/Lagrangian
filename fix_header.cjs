const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const targetHeader = `      {/* Title & Status Indicator */}
      <div className="px-4 py-3 bg-white border-b border-black flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <span className={\`h-2.5 w-2.5 rounded-full \${isPlaying ? 'bg-black animate-pulse' : 'bg-gray-300 border border-black'}\`} />
          Coordinate Visualizer
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 px-2 text-xs border border-black hover:bg-black hover:text-white transition flex items-center justify-center gap-1.5 w-20"
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
          <button
            onClick={handleReset}
            className="p-1 border border-black hover:bg-black hover:text-white transition"
            title="Reset to default coordinates"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>`;

const newHeader = `      {/* SVG Canvas Frame */}`;
if(code.indexOf(targetHeader) !== -1) {
  code = code.replace(targetHeader, newHeader);
  console.log("header removed");
} else {
  console.log("target not found");
}
fs.writeFileSync('src/components/SystemDiagram.tsx', code);
