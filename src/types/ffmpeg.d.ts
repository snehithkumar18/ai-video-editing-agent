declare module 'ffprobe-static' {
  const ffprobePath: { path: string };
  export = ffprobePath;
}

declare module 'ffmpeg-static' {
  const ffmpegPath: string;
  export = ffmpegPath;
}
