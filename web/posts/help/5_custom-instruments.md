---
shortTitle: 'Using custom instruments'
title: 'Working with custom instruments in your note block songs'
date: '2024-10-07'
author: 'Bentroen'
authorImage: 'bentroen.png'
image: '/img/help/5_custom_instruments.png'
---

In Note Block Studio, you can create custom instruments to use any sound file you want in your song! This guide will walk you through the process of creating and using custom instruments, so you can add unique sounds to your songs and make them stand out.

## Using custom instruments

Custom instruments in Note Block Studio allow you to use any sound file you want in your song. This means you can create unique sounds that aren't available in the default set of instruments, and add a personal touch to your music!

Here's how you can create and use custom instruments in Note Block Studio:

1. Launch Note Block Studio and click _Create a new song_ to start a new project.

2. Click the _Settings_ menu at the top of the window, and select the _Instrument settings..._ entry.

3. In the _Instrument settings_ window, click the _Add_ button to create a new custom instrument. It will be added below the list of default instruments.

4. Click the label that reads _None_ to select a sound file from your computer. You can use any sound file in a format supported by Note Block Studio, such as `.ogg`, `.wav`, or `.mp3`.

5. If your sound is not tuned to the default Minecraft note block pitch (F#4), you can adjust the _Pitch_ setting to match the pitch of the sound file. This will compensate for the difference in pitch, making your sound match the piano keys correctly.

6. Change the _Press_ setting to determine whether or not this instrument will cause piano keys to show the press animation when played.

   > **Tip:** You typically wouldn't want drums to show the key press animation, but you might want it for a piano and other melodic instruments.

7. Click _OK_ to close the dialog.

You've added a custom instrument to your song! You can now use it just like any other instrument in Note Block Studio.

## Limitations when working with custom instruments

There are a few limitations to keep in mind when working with custom instruments in Note Block Studio:

- **Custom instruments are not saved with the song file**: Song files only store the custom instrument settings, not the sound files themselves. This means that if you share your song with someone else, they won't have access to your custom instruments unless you also share the sound files you used. There are two ways to work around this limitation:

  - **Share the sound files** along with the song file, so others can use the custom instruments in your song. You can save the song in a ZIP file that includes the sound files you used by going to _File_ > _Save song with custom sounds..._. Alternatively, you can save only the instruments to a ZIP file by going to _Settings_ > _Instrument settings..._ and clicking _Export sounds_.
  - **Use the same sound files** for custom instruments in all your songs, so you don't have to share them every time you share a song. In the section _Downloading songs that use custom instruments_ further down this article, you'll learn how to obtain Minecraft sound files that you can use to standardize the reference to your custom sound files.

- **Custom instruments are not fully supported in Minecraft.** Schematics created from songs using custom instruments will not include the custom instruments, as note blocks don't support custom instruments. Data packs, on the other hand, can be used to add custom instruments to Minecraft, but this requires additional setup and is not currently supported by Note Block Studio out of the box.

- **Note Block World only supports sound files present in Minecraft.** Unfortunately, Note Block World doesn't support custom instruments you may have made yourself, as we'd like to keep songs in a Minecraft feel! However, you can use Minecraft sounds other than the default note block sounds in your songs and select them when uploading to Note Block World.

When you upload a song to Note Block World that uses custom instruments, you'll need to manually select the sound files for each custom instrument you used. This ensures that your song sounds the way you intended it to sound, even if the listener doesn't have the custom instruments installed.

## Uploading songs with custom instruments

Note Block World lets you use any sound in the latest Minecraft version in your songs!

When you upload a song that uses custom instruments to Note Block World, you'll need to manually select the sound files for each custom instrument you used. This ensures that your song sounds the way you intended it to sound, even if the listener doesn't have the custom instruments installed.

Uploading a song with custom instruments follows the same process as [uploading a regular song](/help/1-creating-song), with the addition of manually selecting the sound files for your custom instruments. Here's how you can do it:

1. After you've filled in the song's title, description, and other metadata, you'll see a section labeled _Custom instruments_.

2. For each custom instrument you used in your song, choose the Minecraft sound file that corresponds to it. If in doubt, you can check the [Minecraft Asset Browser](http://mcasset.cloud/) to see if the sound file matches the one you intended.

   > **Tip:** we're working with a limited selection of sounds for the time being, so some custom instruments may not be available. We're working on expanding the selection, so stay tuned for updates! In the meantime, you can request a particular sound file to be added to the selection by [contacting us](/about).

3. Once you've selected the sound files for all your custom instruments, click the _Upload_ button to upload your song.

That's it! Your song is now live on Note Block World, complete with custom instruments that make it stand out from the rest. Keep in mind that your song will no longer be marked as note block compatible, as custom instruments are not supported in Minecraft.

## Changing the instruments of an existing song

If you've already uploaded a song to Note Block World and found out it's not sounding as intended, you can change the custom instrument sound files without needing to reupload the song. Here's how you can do it:

1. Make sure you're signed in to Note Block World.

2. Click on your profile picture in the top right corner of the page, and select _My songs_ from the dropdown menu.

3. Find the song you want to edit, and click on the _Edit song_ (pencil) button under the _Actions_ column.

4. Scroll down to the _Custom instruments_ section, and select the correct sound files for each custom instrument you used in your song.

5. Click the _Save changes_ button to save your changes.

That's it! Your song now uses the correct custom instrument sound files. You can listen to it again to make sure it sounds the way you intended.

## Downloading songs that use custom instruments

When opening a song in Note Block Studio via the _Open in NBS_ button, the file you get already contains the custom sound files used in the song, so no additional steps are necessary to hear the song as the creator intended.

However, when you _download_ a song from Note Block World that uses custom instruments, you'll need to obtain the custom instrument sound files separately. This is because the `.nbs` file format doesn't support embedding custom instrument sound files.

Note Block Studio 3.11 and above comes with a feature to import custom instrument sound files straight from your _Minecraft: Java Edition_ installation. This allows you to both use the sounds in your own songs, as well as listen to songs that use custom instruments you download from Note Block World.

And the good news is that you only need to do this once! After you obtain the custom instrument sound files, you can use them for any song that uses custom instruments you download in the future.

Here are the steps to do this using Note Block Studio:

1. Open the _Minecraft Launcher_.

2. Download and launch the latest stable version of the game to make sure you have the most up-to-date sound files.

3. Launch Note Block Studio, and click _Create a new song_ if prompted.

4. In the _Settings_ menu, look for _Import sounds from Minecraft_. The _Import sounds_ assistant should appear.

5. If your Minecraft installation is in the default location (`C:/Users/<your_username>/AppData/Roaming/.minecraft` on Windows), the assistant should automatically detect it. If not, you can manually select the Minecraft directory by clicking the _Change_ button.

6. Select the version you want to import sounds from. If you're not sure which version to choose, the latest version found in your Minecraft installations should already be selected.

7. If the sound files have been located properly, you should see an indication such as _3,800 sounds located!_. Then, click _Import sounds_ to copy the sound files from Minecraft to Note Block Studio.

8. Wait for a bit while the sounds are copied.

9. Once the import is complete, you should see the message such as _3,800 sounds have been copied!_.

10. You can now close the _Import sounds_ assistant.

You're all set! You can now listen to songs that use custom instruments you download from Note Block World, or use the sounds in your own songs.
