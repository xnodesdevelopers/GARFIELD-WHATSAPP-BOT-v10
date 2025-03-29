use neon::prelude::*;
use rusty_ytdl::{Video, VideoOptions, VideoQuality, VideoSearchOptions};
use std::path::Path;
use tokio;

// Async function to download YouTube video/audio
async fn download_youtube(url: String, output_path: String, audio_only: bool, cookies: Option<String>) -> Result<(), Box<dyn std::error::Error>> {
    // Configure video options based on audio_only flag
    let video_options = VideoOptions {
        quality: if audio_only { VideoQuality::Lowest } else { VideoQuality::Q360p }, // Lowest for audio, 360p for video
        filter: if audio_only { VideoSearchOptions::Audio } else { VideoSearchOptions::VideoAudio },
        download_options: None, // Default download settings
        ..Default::default()
    };

    // Initialize the Video struct with URL, options, and cookies (if provided)
    let mut video = if let Some(cookie_str) = cookies {
        let mut builder = Video::builder(url.clone(), video_options);
        builder.cookies(cookie_str); // Add cookies for restricted content
        builder.build()?
    } else {
        Video::new_with_options(url.clone(), video_options)?
    };

    // Download the file to the specified path
    let path = Path::new(&output_path);
    video.download(path).await?;

    // Verify the file was created
    if !path.exists() {
        return Err("Output file was not created".into());
    }

    Ok(())
}

// Neon binding to expose the function to Node.js
fn download_video(mut cx: FunctionContext) -> JsResult<JsPromise> {
    // Extract arguments from Node.js
    let url = cx.argument::<JsString>(0)?.value(&mut cx);
    let output_path = cx.argument::<JsString>(1)?.value(&mut cx);
    let audio_only = cx.argument::<JsBoolean>(2)?.value(&mut cx);
    let cookies = cx.argument_opt(3)
        .and_then(|arg| arg.downcast::<JsString, _>(&mut cx).ok())
        .map(|js_str| js_str.value(&mut cx));

    let channel = cx.channel();
    let (deferred, promise) = cx.promise();

    // Spawn an async task to perform the download
    tokio::spawn(async move {
        match download_youtube(url, output_path, audio_only, cookies).await {
            Ok(_) => deferred.resolve(&channel, cx.undefined()), // Success
            Err(e) => deferred.reject(&channel, cx.error(e.to_string())?), // Failure
        }
    });

    Ok(promise)
}

// Register the Neon module
#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("downloadVideo", download_video)?;
    Ok(())
}
