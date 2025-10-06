#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function getDenoVersion{<#${/*'>/dev/null )` 2>/dev/null;getDenoVersion() { #>
echo "2.5.3"; : --% ' |out-null <#'; }; deno_version="$(getDenoVersion)"; deno="$HOME/.deno/$deno_version/bin/deno"; target_script="$0"; disable_url_run="";  if [ -n "$_u" ] && [ -z "$disable_url_run" ]; then target_script="$_u"; fi; if [ -x "$deno" ];then  exec "$deno" run -q -A --no-lock --no-config "$target_script" "$@";  elif [ -f "$deno" ]; then  chmod +x "$deno" && exec "$deno" run -q -A --no-lock --no-config "$target_script" "$@"; fi; has () { command -v "$1" >/dev/null; };  set -e;  if ! has unzip && ! has 7z; then echo "Can I try to install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" =~ ^[Yy] ]; then  if ! has brew; then  brew install unzip; elif has apt-get; then if [ "$(whoami)" = "root" ]; then  apt-get install unzip -y; elif has sudo; then  echo "I'm going to try sudo apt install unzip";read ANSWER;echo;  sudo apt-get install unzip -y;  elif has doas; then  echo "I'm going to try doas apt install unzip";read ANSWER;echo;  doas apt-get install unzip -y;  else apt-get install unzip -y;  fi;  fi;  fi;   if ! has unzip; then  echo ""; echo "So I couldn't find an 'unzip' command"; echo "And I tried to auto install it, but it seems that failed"; echo "(This script needs unzip and either curl or wget)"; echo "Please install the unzip command manually then re-run this script"; exit 1;  fi;  fi;   if ! has unzip && ! has 7z; then echo "Error: either unzip or 7z is required to install Deno (see: https://github.com/denoland/deno_install#either-unzip-or-7z-is-required )." 1>&2; exit 1; fi;  if [ "$OS" = "Windows_NT" ]; then target="x86_64-pc-windows-msvc"; else case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; "Linux aarch64") target="aarch64-unknown-linux-gnu" ;; *) target="x86_64-unknown-linux-gnu" ;; esac fi;  print_help_and_exit() { echo "Setup script for installing deno  Options: -y, --yes Skip interactive prompts and accept defaults --no-modify-path Don't add deno to the PATH environment variable -h, --help Print help " echo "Note: Deno was not installed"; exit 0; };  for arg in "$@"; do case "$arg" in "-h") print_help_and_exit ;; "--help") print_help_and_exit ;; "-"*) ;; *) if [ -z "$deno_version" ]; then deno_version="$arg"; fi ;; esac done; if [ -z "$deno_version" ]; then deno_version="$(curl -s https://dl.deno.land/release-latest.txt)"; fi;  deno_uri="https://dl.deno.land/release/v${deno_version}/deno-${target}.zip"; deno_install="${DENO_INSTALL:-$HOME/.deno/$deno_version}"; bin_dir="$deno_install/bin"; exe="$bin_dir/deno";  if [ ! -d "$bin_dir" ]; then mkdir -p "$bin_dir"; fi;  if has curl; then curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri"; elif has wget; then wget --output-document="$exe.zip" "$deno_uri"; else echo "Error: curl or wget is required to download Deno (see: https://github.com/denoland/deno_install )." 1>&2; fi;  if has unzip; then unzip -d "$bin_dir" -o "$exe.zip"; else 7z x -o"$bin_dir" -y "$exe.zip"; fi; chmod +x "$exe"; rm "$exe.zip";  exec "$deno" run -q -A --no-lock --no-config "$0" "$@";       #>}; $DenoInstall = "${HOME}/.deno/$(getDenoVersion)"; $BinDir = "$DenoInstall/bin"; $DenoExe = "$BinDir/deno.exe"; $TargetScript = "$PSCommandPath"; $DisableUrlRun = "";  if ($Env:_u -and $DisableUrlRun) { $TargetScript = "$Env:_u"; };  if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir/deno.zip"; $DenoUri = "https://github.com/denoland/deno/releases/download/v$(getDenoVersion)/deno-x86_64-pc-windows-msvc.zip";  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;  if (!(Test-Path $BinDir)) { New-Item $BinDir -ItemType Directory | Out-Null; };  Function Test-CommandExists { Param ($command); $oldPreference = $ErrorActionPreference; $ErrorActionPreference = "stop"; try {if(Get-Command "$command"){RETURN $true}} Catch {Write-Host "$command does not exist"; RETURN $false}; Finally {$ErrorActionPreference=$oldPreference}; };  if (Test-CommandExists curl) { curl -Lo $DenoZip $DenoUri; } else { curl.exe -Lo $DenoZip $DenoUri; };  if (Test-CommandExists curl) { tar xf $DenoZip -C $BinDir; } else { tar -Lo $DenoZip $DenoUri; };  Remove-Item $DenoZip;   }; & "$DenoExe" run -q -A --no-lock --no-config "$TargetScript" @args; Exit $LastExitCode; <# 
# */0}`;
import { Console, cyan, green, magenta, yellow, dim } from "https://deno.land/x/quickr@0.8.4/main/console.js"
import { FileSystem } from "https://deno.land/x/quickr@0.8.4/main/file_system.js"
import { parseArgs, flag, required, initialValue } from "https://deno.land/x/good@1.7.1.0/flattened/parse_args.js"
import { toCamelCase } from "https://deno.land/x/good@1.7.1.0/flattened/to_camel_case.js"
import { didYouMean } from "https://deno.land/x/good@1.7.1.0/flattened/did_you_mean.js"

import { enhanceScript } from "./universify-api.js"
import { version } from "./version.js"

// 
// check for help/version
// 
    const { help: showHelp, version: showVersion, } = parseArgs({
        rawArgs: Deno.args,
        fields: [
            [["--help", ], flag, ],
            [["--version"], flag, ],
        ],
    }).simplifiedNames
    if (showVersion) {
        console.log(version)
        Deno.exit(0)
    }
    if (showHelp) {
        console.log(`
    Universify
        examples:
            uni ./your_file.js
            uni ./your_file.js ${Deno.version.deno}
            uni ./your_file.js --deno-version ${Deno.version.deno}
            uni --version
            uni --file ./your_file.js
            uni --file ./your_file.js --deno-version ${Deno.version.deno}
            uni --file ./your_file.js --disable-url-run
            uni --file ./your_file.js --single-file
            uni --file ./your_file.js --no-ps1
            uni --file ./your_file.js \\
                --add-arg '--no-npm' \\
                --add-arg '--unstable'
            
            uni --file ./your_file.js \\
                --add-unix-arg '--unstable-ffi' \\
                --add-windows-arg '--unstable-cron'
            
            uni --file ./your_file.js \\
                --no-default-args \\
                --add-arg '--quiet' \\
                --add-arg '--allow-read'
        `)
        Deno.exit(0)
    }

// 
// normal usage
// 
    const output = parseArgs({
        rawArgs: Deno.args,
        fields: [
            [[0, "--file",], required ],
            [[1, "--deno-version"], initialValue(`${Deno.version.deno}`), ],
            [["--no-default-args"], flag, ],
            [["--disable-url-run"], flag, ],
            [["--single-file"], flag, ],
            [["--no-ps1"], flag, ],
            [["--add-arg"], initialValue([]), ],
            [["--add-unix-arg"], initialValue([]), ],
            [["--add-windows-arg"], initialValue([]), ],
        ],
        nameTransformer: toCamelCase,
        namedArgsStopper: "--",
        allowNameRepeats: true,
        valueTransformer: JSON.parse,
        isolateArgsAfterStopper: false,
        argsByNameSatisfiesNumberedArg: true,
        implicitNamePattern: /^(--|-)[a-zA-Z0-9\-_]+$/,
        implictFlagPattern: null,
    })
    didYouMean({
        givenWords: Object.keys(output.implicitArgsByName).filter(each=>each.startsWith(`-`)),
        possibleWords: Object.keys(output.explicitArgsByName).filter(each=>each.startsWith(`-`)),
        autoThrow: true,
    })
    
    let {
        file: path,
        denoVersion,
        addArg : additionalArgs,
        addUnixArg: additionalArgsForUnix,
        addWindowsArg: additionalArgsForWindows, 
        noDefaultArgs,
        disableUrlRun,
        singleFile,
        noPs1,
    } = output.simplifiedNames

// 
// 
// main logic
//
// 
    // 
    // validate
    // 
    const fileDoesntExist = await Deno.lstat(path).catch(()=>({doesntExist: true})).doesntExist
    if (fileDoesntExist) {
        console.log(`Hey! the file you gave me doesn't seem to exist: ${path}`)
        Deno.exit(1)
    }

    // 
    // setup
    // 
    const contents = Deno.readTextFileSync(path)
    if (noPs1) {
        singleFile = true
    }

    // 
    // enhance script
    // 
    let { newContents, symlinkPath, normalPath, ps1Path } = enhanceScript({
        filePath: path,
        jsFileContent: contents,
        denoVersion,
        additionalArgs:           typeof additionalArgs           === "string" ? [ additionalArgs ] : additionalArgs,
        additionalArgsForUnix:    typeof additionalArgsForUnix    === "string" ? [ additionalArgsForUnix ] : additionalArgsForUnix,
        additionalArgsForWindows: typeof additionalArgsForWindows === "string" ? [ additionalArgsForWindows ] : additionalArgsForWindows,
        baseArgs: noDefaultArgs ? [] : [ "-q", "-A", "--no-lock", "--no-config", ],
            // NOTE: no lock is given because different versions of deno can have different lock file formats
            //       meaning the script will fail to run with the specified version of deno
            //       if another version of deno is installed
        disableUrlRun,
        noPs1,
    })

    // 
    // make sure ps1 version exists
    // 
    // note: if noPs1 is true, then ps1Path will be a bit of a misnomer (no .ps1 extension)
    console.log(`Creating ${ps1Path}`)
    await FileSystem.write({
        data: newContents,
        path: ps1Path,
        overwrite:true,
    })
    console.log(`Setting ${ps1Path} permissions`)
    try {
        await FileSystem.addPermissions({
            path: ps1Path,
            permissions: {
                owner:{
                    canExecute: true,
                },
                group:{
                    canExecute: true,
                },
                others:{
                    canExecute: true,
                }
            }
        })
    } catch (error) {
        if (Deno.build.os != 'windows') {
            console.warn(`I was unable to make this file an executable, just fyi: ${ps1Path}`)
        }
    }


    // 
    // link the other version to it
    // 
    if (!singleFile) {
        console.log(`Creating ${normalPath}`)
        FileSystem.sync.remove(normalPath)
        Deno.symlinkSync(
            symlinkPath,
            normalPath,
            {
                type: "file",
            }
        )
        console.log(`Setting ${normalPath} permissions`)
        try {
            await FileSystem.addPermissions({
                path: normalPath,
                permissions: {
                    owner:{
                        canExecute: true,
                    },
                    group:{
                        canExecute: true,
                    },
                    others:{
                        canExecute: true,
                    }
                }
            })
        } catch (error) {
            if (Deno.build.os != 'windows') {
                console.warn(`I was unable to make this file an executable, just fyi: ${normalPath}`)
            }
        }
    }
    console.log(`\n\nDone! ✅\n\n`)
    if (disableUrlRun) {
        console.log(`Run locally with:`)
        const parentFolder = FileSystem.makeRelativePath({ from: FileSystem.pwd, to: FileSystem.dirname(normalPath) })
        console.log(yellow`    cd ${parentFolder}`)
        console.log(yellow(`    ./${FileSystem.basename(normalPath)}`.replace(/^    \.\/\.\//, "    ./")))
    } else {
        console.log(`Run locally with:`)
        const parentFolder = FileSystem.makeRelativePath({ from: FileSystem.pwd, to: FileSystem.dirname(normalPath) })
        console.log(yellow`    cd ${parentFolder}`)
        console.log(yellow(`    ./${FileSystem.basename(normalPath)}`.replace(/^    \.\/\.\//, "    ./")))

        console.log(`\nRun from anywhere with:`)
        console.log(yellow`    function u { echo URL_TO_THAT_FILE; };$Env:_u=$(u) || export _u=$(u); irm "$(u)"|iex || curl -fsSL "$_u" | sh`)
        // 
        // try to be helpful by pre-calculating the url for those using github
        // 
        try {
            const gitParentFolderOrNull = await FileSystem.walkUpUntil(".git/config")
            if (gitParentFolderOrNull) {
                const gitParentFolder = gitParentFolderOrNull
                const gitBranchOrTagOrCommitHash = (await FileSystem.read(`${gitParentFolder}/.git/HEAD`)).trim().replace(/^(ref: )?/,"")
                const configString = (await FileSystem.read(`${gitParentFolder}/.git/config`))
                let originUrlProbably
                for (let each of configString.split(/\n/g)) {
                    if (each.match(/^\s*url = /)) {
                        originUrlProbably = each.split("=")[1].trim()
                        break
                    }
                }
                let match, githubUsername, repoName
                // ex: git@github.com:jeff-hykin/universify.git
                if (match=originUrlProbably.match(/^git@github\.com:([^\/]+)\/([^\/]+)\.git$/)) {
                    githubUsername = match[1]
                    repoName = match[2]
                // ex: https://github.com/jeff-hykin/universify.git
                } else if (match=originUrlProbably.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\.git)?$/)) {
                    githubUsername = match[1]
                    repoName = match[2]
                }
                if (githubUsername && repoName) {
                    const relativePath = FileSystem.makeRelativePath({ from: gitParentFolderOrNull, to: ps1Path })
                    console.log(``)
                    console.log(dim`    If you're using github your one-liner will look like this:`)
                    const url = `https://raw.githubusercontent.com/${githubUsername}/${repoName}/${gitBranchOrTagOrCommitHash}/${relativePath}`
                    console.log(yellow.dim`    function u { echo '${url}'; };$Env:_u=$(u) || export _u=$(u); irm "$(u)"|iex || clear;curl -fsSL "$_u" | sh`)
                }
            }
        } catch (error) {
            console.log(dim`    If your script is part of a github repo, the url will follow this format:`)
            console.log(dim`    https://raw.githubusercontent.com/GITHUB_USERNAME/REPO_NAME/BRANCH_NAME_TAG_NAME_OR_COMMIT_HASH/PATH_TO_THIS_SCRIPT`)
        }

        console.log(``)
        console.log(`   NOTE1: if you are NOT using the run-from-url`)
        console.log(`          please disable by rerunning with the --disable-url-run flag`)
        console.log(`   NOTE2: when running from a url unfortunately`)
        console.log(`          there is no practical way to pass arguments`)
    }

// (this comment is part of universify, dont remove) #>