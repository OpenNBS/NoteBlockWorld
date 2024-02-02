import os
import sys

print(sys.version)


def create_futureDir(feature_name):
    context_path = f"modules/{feature_name}/components/client/"
    components = f"modules/{feature_name}/components"
    server_util = f"modules/{feature_name}/features/"
    dir_list = [context_path, components, server_util]
    for dir in dir_list:
        # check if the directory exists
        if os.path.exists(dir):
            continue
        os.makedirs(dir, exist_ok=True)
        # create a gitkeep in each directory
        with open(f"{dir}/.gitkeep", "w") as f:
            f.write("")


features = [
    "auth",
    "shared",
    # songs
    "upload",
    "browse",
    "my-songs",  # list all songs uploaded by the user
    "edit-song",  # edit song details
    "listen",  # listen to a song
    # users
    "user",
    "edit-profile",
]

for feature in features:
    create_futureDir(feature)
"""
#app
    (main)
        "auth",
        "common",
        "my-songs",
        "song",
        "edit_song/[song_id]",
        "edit_profile",
        "upload",
        "browse",

#modules
    "auth",
    "common",
    "my-songs",
    "song",
    "edit_song/[song_id]",
    "edit_profile",
    "upload",
    "browse",



    (main)
        upload/
        browse/
        my_songs/
        layout.tsx

    # "search",
    # "playlists",
    # "comment",


    
]
"""
