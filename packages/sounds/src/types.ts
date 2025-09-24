export type VersionSummary = {
    id             : string;
    type           : 'release' | 'snapshot' | 'old_beta' | 'old_alpha';
    url            : string;
    time           : string;
    releaseTime    : string;
    sha1           : string;
    complianceLevel: number;
};

export type VersionManifest = {
    latest: {
        release : string;
        snapshot: string;
    };
    versions: VersionSummary[];
};

type Action = 'allow' | 'disallow';

type OS = {
    name: string;
};

type Rule = {
    action: Action;
    os    : OS;
};

type Artifact = {
    path: string;
    sha1: string;
    size: number;
    url : string;
};

type Downloads = {
    artifact: Artifact;
};

type Library = {
    downloads: Downloads;
    name     : string;
    rules?   : Rule[];
};

type File = {
    id  : string;
    sha1: string;
    size: number;
    url : string;
};

type Client = {
    argument: string;
    file    : File;
    type    : string;
};

type Logging = {
    client: Client;
};

export type VersionData = {
    arguments: {
        game: (string | { rules: Rule[]; value: string })[];
        jvm : string[];
    };
    assetIndex: {
        id       : string;
        sha1     : string;
        size     : number;
        totalSize: number;
        url      : string;
    };
    assets         : string;
    complianceLevel: number;
    downloads: {
        client         : Artifact;
        client_mappings: Artifact;
        server         : Artifact;
        server_mappings: Artifact;
    };
    id                    : string;
    libraries             : Library[];
    logging               : Logging;
    mainClass             : string;
    minimumLauncherVersion: number;
    releaseTime           : string;
    time                  : string;
    type                  : string;
};

export type AssetIndexRecord = Record<string, { hash: string; size: number }>;

export type AssetIndexData = {
    objects: AssetIndexRecord;
};
