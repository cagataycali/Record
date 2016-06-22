const config = {};

config.aws = {
  accessToken: 'xxx',
  secretAccessKey: 'xxx',
  bucket: 'xxx',
  key: 'test.mp4',
};

config.video = {
  duration: 5,
  output: 'out.webm',
  ffmpeg: false,
  upload: false,
  webdriver: false,
};

config.webdriver = {
  width: 1280,
  height: 720,
}

config.s3 = {
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
};

// ffmpeg           :
// ffmpeg -i out.webm -c:v mpeg4 -b:v 48k  movie.mp4
// ffmpeg with audio:
// ffmpeg -i out.webm -i audio.vaw -c:v mpeg4 -c:a vorbis -b:v 48k -b:a 4k movie.mp4
config.ffmpeg = {
  output: 'movie.mp4',
  audio: false,
  audioPath: 'audio.vaw',
};

export default config;
