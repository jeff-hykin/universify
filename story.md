# The World's First Universal Script
#### By Jeff Hykin ([Github](https://github.com/jeff-hykin), [Telegram](https://t.me/jeff_hykin), [Discord](discordapp.com/users/266399494793330689), [Email](mailto:jeff.hykin+uni@gmail.com))


If you end up enjoying this post, consider starring the [repo](https://github.com/jeff-hykin/universify).
<br>
<br>
<br>
Windows comes with Powershell/CMD. Minimal Linux and MacOS come with bash/zsh/dash/sh. So there is no unified script that runs out-of-the-box all major systems... right?
<br><br>
Allow me to guide you down a wonderful rabbit hole. Not only are universal scripts possible, they're practical.

# Part 1: Semi-Universal Scripts

Save the following as `hello_world.ps1`, add the execute permission, and run it.<br>Doesn't matter what OS.

```sh
#!/usr/bin/env sh
echo --% >/dev/null;: ' | out-null
<#'

echo "hello world" # sh

exit #>

echo "hello world" # powershell

```

I call this semi-universal.

I would love to dive into the hacky "features" of bash and powershell that make it possible (those details can be found in [my stack overflow answer](https://stackoverflow.com/a/67292076/4367134)), but let us focus on two points:
 <!-- like bash not doing any syntax checks or powershell's absurd stop-parsing operator `--%`. And while the gritty details can be found in [my stack overflow answer](https://stackoverflow.com/a/67292076/4367134), lets focus on two important points: -->

1. The "hello world" program above is general purpose. Pasting any (legitimately any) valid powershell code in the powershell section will cause the script to work (or not-work) as it normally would on Windows. The same is true for almost any (99.9%) bash code. And, with escaping, even the remaining 0.1% of bash programs work too.
2. How is this possible? Well the idea is very straightforward. Every line in that file is simultaneously valid bash and valid powershell syntax (a [polyglot program](https://www.youtube.com/watch?v=2L6EE6ZgURE)). The execution of that file is where there are a few quirks. At runtime, Windows only cares about the file extension (.ps1), which tells Windows to run the file as powershell. On Linux and MacOS, the file extension doesn't matter. Instead the shebang at the top (which is a normal comment in powershell) tells the OS to run the script with sh.

While cute, this script is only semi-universal because it is merely two platform-specific scripts in one file. I wouldn't be writing this post if the true universal script was anything less than a unified (one language), practical, editable (not compiled/mangled), standalone (no side-effects), reliable (version-pinned spec-based), general-purpose script with support for packages/modules.

So how does the party trick above help us get to the true universal script? The next logical step would be to try bootstrapping either bash or powershell, making one of those run on the other system(s), thereby making it (bash or powershell) the world's first universal scripting language. Yes... that would be the next logical step. After all, it would be completely impractical to introduce a third language. Right? Every line of the script would need to be valid bash, valid powershell, and valid as some third language, and there is no *practical* way to do that. Right?

# Part 2: Cramming in a 3rd Language

When it comes to programming syntax, we as programmers have a lot of choice: indent-based Python, end-based Ruby, C-style languages, ~~Haskell~~ Elixir. For a universal script we could even use Zig, Go, or Rust by simply running the code immediately after compiling ([Rust supports shebangs by the way](https://stackoverflow.com/a/41325202/4367134)). How many of those languages have a syntax that is compatible with bash and powershell?

I don't know. Thankfully it doesn't matter. The universal script only needs one more language. 

So why I am beating around the bush?

The truth is the world's first universal script could only ever be one language. Maybe it is dawning on you what language I am about to mention. We can claim it didn't have to be this way -- there must be another compatible syntax. Maybe there is. But deep down you and I know it is fate.<br>
<br>
The world's first universal scripting language:
- The language no programmer can truly escape.
- The language destined from birth to rule over all languages.
- The language that crashes iPhones, CloudFlare, Teslas, and homemade websites alike.

I'm, of course, talking about:<br>


![javascript i love it](https://github.com/user-attachments/assets/1c2779a6-bbce-480e-9abf-ee61c3235403)


Not only can one file be, simultaneously, valid JavaScript, valid powershell, valid bash -- but actually, with a bit of escaping, any possible combination JavaScript, powershell, and bash code can be fit all into the same file, all at the same time.

```
#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null; <#${/*'>/dev/null )` 2>/dev/null;

    echo "Hello bash/sh"

exit #>

    echo "Hello powershell"

<# */0}`;
    
    console.log("Hello JavaScript")
    
// #>
```

We are about to start moving fast, so hold on tight. There some obvious and less-obvious problems with the script above.

1. There are new escaping caveats. Soon these caveats won't matter, but just FYI pasting powershell, bash, or JS may not work 100% as-is.
2. The main issue: the JavaScript code exists, but is not executed. This is where things get fun. The script can just run itself. Both bash and powershell have a way to get the filepath of the currently-being-executed script. So, yes, the world's first universal script involves cross-language recursion, albeit shallow recursion.
3. While the script can easily run itself, there is a minor problem and two catastrophic problems. These are, respectively, the JavaScript runtime, the JavaScript runtime, and finally the JavaScript runtime.

# Part 3: The Runtime Problem

The minor issue: the system might not have NodeJS. With a mix of dread, excitement, and guilt please consider: What if the entire NodeJS installer -- both the bash installer and powershell installer -- was embedded into the script? Meaning, when the script tries to run itself, if the system doesn't have NodeJS, the script *just gets NodeJS* and tries to run itself again.

Before we consider which clauses of the Geneva Convention that idea violates, lets consider the first of the catastrophic problems. That problem can be summarized as:
1. The world's first universal script should be reliable.
2. We just installed NodeJS.

Can those things coexist? Can the entire NodeJS installer(s) be crammed into one file?

I don't know.

Thankfully (again) we don't need to know. The structure of the world's first universal script may already be a crime, but including NodeJS is simply too far. Instead lets consider using a good JS runtime like Deno.

# Part 4: What about Npm Packages?

This is the second catastrophic problem:
1. The world's first universal script should not have side effects.
2. JavaScript is, obviously, completely and utterly useless without modules.

How is a universal script supposed to figure out if a number is even or odd? Well we may never know, because Deno not only supports everyone's favorite supply chain attack vector, but also does so without an `install` command, bundling, or a `node_modules` side effect. For reliability and security -- if you're into that sort of thing -- it can also easily pin versions:

```js
import malware from "https://esm.sh/chalk"
import chalk from "https://esm.sh/chalk@5.6.2"
import isEven from "https://esm.sh/is-even@1.0.0"
console.log(isEven(2)) // true
```

For importing your own code, you can (and arguably should) bypass npm entirely.

```js
// import your nodejs-style typescript from github thanks to our friends at esm.sh
import thing from "https://esm.sh/gh/YOUR_GITHUB_USERNAME/REPO@BRANCH_OR_TAG/path/to/your/code.ts"
// import your JS from github directly:
import thing from "https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/REPO_NAME/BRANCH_NAME_TAG_NAME_OR_COMMIT_HASH/path/to/your/code.ts"
// and generally use https://jsr.io/ if you want package management
import { encodeBase64 } from "https://esm.sh/jsr/@std/encoding@1.0.0/base64"
// or import JS directly from any cdn/gitlab/git-tea/your own server/etc
```

# Part 5: Heinous Reliability

Now that the module issue has been addressed, we need to return to the other runtime issue. Can the bash installer and powershell installer for Deno be crammed into a single file? What about installer side effects? What about runtime versioning?

Although it might make some devs uncomfortable, there is a very straightforward solution for versioning. If the script was tested with Deno 2.4.3, simply install Deno 2.4.3 on the host system.

What about side effects? All installers have side effects, most of which are unacceptable for a universal script. Thankfully, when it comes analyzing side effects, Deno's combined installer is 1000 lines shorter than Node's. It is also useful to know Deno can execute code with a single binary, a binary that can be stored anywhere on a system. That means modifying the user's system is not inherently necessary.

The runtime solution: By editing setting `DENO_INSTALL` and `deno_version` followed by commenting out a few sections of the Deno installer, we can turn it into a mere Deno-version-downloader. The script downloads a specific version of Deno to `$HOME/.deno/$deno_version/`. This gets us versioning, caching, and prevention of all (meaningful) installer side effects. If that path is missing (e.g. not cached), then it is downloaded. Once it exists (either cached or downloaded), the script runs itself using that executable.

Put it all together and voila, the world's first universal script:

```js
#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function getDenoVersion{<#${/*'>/dev/null )` 2>/dev/null;getDenoVersion() { #>
echo "2.5.3";: --% ' |out-null <#';};DENO_INSTALL="$HOME/.deno/$(getDenoVersion)";deno_version="v$(getDenoVersion)";deno="$DENO_INSTALL/bin/deno";target_script="$0";disable_url_run="";if [ -n "$_u" ] && [ -z "$disable_url_run" ];then target_script="$_u";fi;if [ -x "$deno" ];then exec "$deno" run -q -A --no-lock --no-config "$target_script" "$@";elif [ -f "$deno" ];then chmod +x "$deno" && exec "$deno" run -q -A --no-lock --no-config "$target_script" "$@";fi;has () { command -v "$1" >/dev/null;};if ! has curl;then if ! has wget;then curl () { wget --output-document="$5" "$6";};else echo "Sorry this script needs curl or wget, please install one or the other and re-run";exit 1;fi;fi;if [ "$(uname)" = "Darwin" ];then unzip () { /usr/bin/tar xvf "$4" -C "$2" 2>/dev/null 1>/dev/null;};fi;if ! has unzip && ! has 7z;then echo "Either the unzip or 7z command are needed for this script";echo "Should I try to install unzip for you?";read ANSWER;echo;if [ "$ANSWER" =~ ^[Yy] ];then if has nix-shell;then unzip_path="$(NIX_PATH='nixpkgs=https://github.com/NixOS/nixpkgs/archive/release-25.05.tar.gz' nix-shell -p unzip which --run "which unzip")" alias unzip="$unzip_path" else;if has apt-get;then _install="apt-get install unzip -y";elif has dnf;then _install="dnf install unzip -y";elif has pacman;then _install="pacman -S --noconfirm unzip";else echo "Sorry, I don't know how to install unzip on this system";echo "Please install unzip manually and re-run this script";exit 1;fi;if [ "$(whoami)" = "root" ];then "$_install";elif has sudo;then sudo "$_install";elif has doas;then doas "$_install";else "$_install";fi;fi;fi;if ! has unzip;then echo "";echo "So I couldn't find an 'unzip' or '7z' command";echo "And I tried to auto install unzip, but it seems that failed";echo "Please install the unzip or 7z command manually then re-run this script";exit 1;fi;fi;if ! command -v unzip >/dev/null && ! command -v 7z >/dev/null;then echo "Error: either unzip or 7z is required to install Deno (see: https://github.com/denoland/deno_install#either-unzip-or-7z-is-required )." 1>&2;exit 1;fi;if [ "$OS" = "Windows_NT" ];then target="x86_64-pc-windows-msvc";else case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;;"Darwin arm64") target="aarch64-apple-darwin" ;;"Linux aarch64") target="aarch64-unknown-linux-gnu" ;;*) target="x86_64-unknown-linux-gnu" ;;esac fi;deno_uri="https://dl.deno.land/release/${deno_version}/deno-${target}.zip";deno_install="${DENO_INSTALL:-$HOME/.deno}";bin_dir="$deno_install/bin";exe="$bin_dir/deno";if [ ! -d "$bin_dir" ];then mkdir -p "$bin_dir";fi;curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri";if command -v unzip >/dev/null;then unzip -d "$bin_dir" -o "$exe.zip";else 7z x -o"$bin_dir" -y "$exe.zip";fi;chmod +x "$exe";rm "$exe.zip";exec "$deno" run -q -A --no-lock --no-config "$0" "$@";#>};$DenoInstall = "${HOME}/.deno/$(getDenoVersion)";$BinDir = "$DenoInstall/bin";$DenoExe = "$BinDir/deno.exe";$TargetScript = "$PSCommandPath";$DisableUrlRun = "";if ($Env:_u -and $DisableUrlRun) { $TargetScript = "$Env:_u";};if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir/deno.zip";$DenoUri = "https://github.com/denoland/deno/releases/download/v$(getDenoVersion)/deno-x86_64-pc-windows-msvc.zip";[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;if (!(Test-Path $BinDir)) { New-Item $BinDir -ItemType Directory | Out-Null;};curl.exe --ssl-revoke-best-effort -Lo $DenoZip $DenoUri;tar.exe xf $DenoZip -C $BinDir;Remove-Item $DenoZip;};& "$DenoExe" run -q -A --no-lock --no-config "$TargetScript" @args;Exit $LastExitCode;<#  
# */0}`;
console.log("Hello World") // dont get rid of this -> #>
```

Any JavaScript that does not contain `#>` can be safely added to that script. The installer/setup code is 5 lines (~3800 characters). If someone really wanted to, I bet a hand-crafted code-golfed version would be under 1000 characters.<br>

If we expand it for readability though, it looks like this:

```js
#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function getDenoVersion{<#${/*'>/dev/null )` 2>/dev/null;getDenoVersion() { #>
        echo "DENO_VERSION_HERE"; : --% ' |out-null <#';
    };
    # getDenoVersion (above) exists as both a bash and powershell function so that DENO_VERSION_HERE is only mentioned in one place (easy to hand-edit)
    # NOTE: semicolons at the end of lines are important for when this script is automatically crushed into a few lines
    DENO_INSTALL="$HOME/.deno/$(getDenoVersion)";
    deno_version="v$(getDenoVersion)";
    deno="$DENO_INSTALL/bin/deno";
    target_script="$0";
    
    # 
    # try to run immediately
    # 
    if [ -x "$deno" ];then 
        exec "$deno" run DENO_UNIX_ARGS_HERE "$target_script" "$@"; 
    fi;
    
    #
    # the official deno installer with parts commented out
    #
    set -e;

    if ! command -v unzip >/dev/null && ! command -v 7z >/dev/null;then
        echo "Error: either unzip or 7z is required to install Deno (see: https://github.com/denoland/deno_install#either-unzip-or-7z-is-required )." 1>&2;
        exit 1;
    fi;

    if [ "$OS" = "Windows_NT" ];then
        target="x86_64-pc-windows-msvc";
    else
        case $(uname -sm) in
        "Darwin x86_64") target="x86_64-apple-darwin" ;;
        "Darwin arm64") target="aarch64-apple-darwin" ;;
        "Linux aarch64") target="aarch64-unknown-linux-gnu" ;;
        *) target="x86_64-unknown-linux-gnu" ;;
        esac
    fi;

    # Arg-parsing commended out because all args are passed to script (stuff like --help should go to the script)
    
    # print_help_and_exit() {
    #     echo "Setup script for installing deno

    # Options:
    # -y, --yes
    #     Skip interactive prompts and accept defaults
    # --no-modify-path
    #     Don't add deno to the PATH environment variable
    # -h, --help
    #     Print help
    # "
    #     echo "Note: Deno was not installed";
    #     exit 0;
    # };
    #
    # # Simple arg parsing - look for help flag, otherwise
    # # ignore args starting with '-' and take the first
    # # positional arg as the deno version to install
    # for arg in "$@"; do
    #     case "$arg" in
    #     "-h")
    #         print_help_and_exit
    #         ;;
    #     "--help")
    #         print_help_and_exit
    #         ;;
    #     "-"*) ;;
    #     *)
    #         if [ -z "$deno_version" ];then
    #             deno_version="$arg"
    #         fi
    #         ;;
    #     esac
    # done
    # if [ -z "$deno_version" ];then
    #     deno_version="$(curl -s https://dl.deno.land/release-latest.txt)"
    # fi

    deno_uri="https://dl.deno.land/release/${deno_version}/deno-${target}.zip";
    deno_install="${DENO_INSTALL:-$HOME/.deno}";
    bin_dir="$deno_install/bin";
    exe="$bin_dir/deno";

    if [ ! -d "$bin_dir" ];then
        mkdir -p "$bin_dir";
    fi;

    curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri";
    if command -v unzip >/dev/null;then
        unzip -d "$bin_dir" -o "$exe.zip";
    else
        7z x -o"$bin_dir" -y "$exe.zip";
    fi;
    chmod +x "$exe";
    rm "$exe.zip";
    
    # commented out below because we don't want to modify the user's env/path (no side effects)

    # echo "Deno was installed successfully to $exe"

    # run_shell_setup() {
    #     $exe run -A --reload jsr:@deno/installer-shell-setup/bundled "$deno_install" "$@"
    # }

    # # If stdout is a terminal, see if we can run shell setup script (which includes interactive prompts)
    # if [ -z "$CI" ] && [ -t 1 ] && $exe eval 'const [major, minor] = Deno.version.deno.split("."); if (major < 2 && minor < 42) Deno.exit(1)';then
    #     if [ -t 0 ];then
    #         run_shell_setup "$@"
    #     else
    #         # This script is probably running piped into sh, so we don't have direct access to stdin.
    #         # Instead, explicitly connect /dev/tty to stdin
    #         run_shell_setup "$@" </dev/tty
    #     fi
    # fi
    # if command -v deno >/dev/null;then
    #     echo "Run 'deno --help' to get started"
    # else
    #     echo "Run '$exe --help' to get started"
    # fi
    # echo
    # echo "Stuck? Join our Discord https://discord.gg/deno"
    
    #
    # end of deno installer
    #
    
    # run self with deno (exec takes over, so no need to Exit)
    exec "$deno" run DENO_UNIX_ARGS_HERE "$0" "$@";

    # 
    # powershell portion
    # 
#>};
    $DenoInstall = "${HOME}/.deno/$(getDenoVersion)";
    $BinDir = "$DenoInstall/bin";
    $DenoExe = "$BinDir/deno.exe";
    $TargetScript = "$PSCommandPath";
    $DisableUrlRun = "DISABLE_URL_RUN_HERE";
    
    # if using the universal one-liner runner, e.g. 
    #       function u { echo URL_TO_THIS_SCRIPT; };$Env:u=$(u) || export u=$(u); irm "$(u)"|iex || curl -fsSL "$u" | sh
    # then the u env var will be set, and we NEED that env var because
    # $0 will NOT be the path to this script, because there is no path to this script in that case 
    # (the script wouldn't be a downloaded file, its just running inline as the output of curl)
    # so if that var is set, that becomes the new target_script
    if ($Env:_u -and $DisableUrlRun) {
        $TargetScript = "$Env:_u";
    };
    
    # if this deno version doesn't exist, get it
    if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) {
        $DenoZip = "$BinDir/deno.zip";
        $DenoUri = "https://github.com/denoland/deno/releases/download/v$(getDenoVersion)/deno-x86_64-pc-windows-msvc.zip";

        # GitHub requires TLS 1.2
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;

        if (!(Test-Path $BinDir)) {
            New-Item $BinDir -ItemType Directory | Out-Null;
        };
        
        curl.exe --ssl-revoke-best-effort -Lo $DenoZip $DenoUri;
        
        tar.exe xf $DenoZip -C $BinDir;
        
        Remove-Item $DenoZip;
        
        # commented out below because we don't want to modify the user's path (no side effects)
        
        # $User = [System.EnvironmentVariableTarget]::User
        # $Path = [System.Environment]::GetEnvironmentVariable('Path', $User)
        # if (!(";${Path};".ToLower() -like "*;${BinDir};*".ToLower())) {
        # [System.Environment]::SetEnvironmentVariable('Path', "${Path};${BinDir}", $User)
        # $Env:Path += ";${BinDir}"
        # }

        # Write-Output "Deno was installed successfully to ${DenoExe}"
        # Write-Output "Run 'deno --help' to get started"
        # Write-Output "Stuck? Join our Discord https://discord.gg/deno"
    
    # run self with deno
    }; & "$DenoExe" run DENO_WINDOWS_ARGS_HERE "$TargetScript" @args; Exit $LastExitCode; <#
# */0}`;

    console.log("Hello World")
    
// #>
```

# Part 6: Going Beyond: Remote Scripts

It may have become clear that the first universal script needs internet. However, don't be too disappointed.
1. Just wait till Deno is compiled with the incredible [cosmopolitan libc](https://github.com/jart/cosmopolitan) and embedded into the script as a base64 string.
2. Universal scripts are most useful as installers, and installers are going to need internet anyway. There isn't too many use-cases for making them work offline.

Speaking of remote code, what is the point of a universal script if we need two separate commands to run it remotely?  For example the Deno installer says:
1. Windows users run `irm https://deno.land/install.ps1 | iex`
2. Linux/MacOS users run `curl -fsSL https://deno.land/install.sh | sh`

What if we could just have one command that ran on both operating systems?

<!-- function iex { alias irm='curl -fsSL $_u | sh ;: ';iex(){ cat;};eval "${1#?}";};iex '$_u="https://raw.githubusercontent.com/jeff-hykin/universify/072ee86790581669ea91be01bbc7ab381b619020/run/hello_world.js";irm $_u|iex' -->

```sh
function iex { irm(){ curl -fsSL $_u|sh;};t=${1#?};eval export ${t%|*};};iex '$_u="https://raw.githubusercontent.com/jeff-hykin/universify/eae24c36f943428640671c54949264a79c71e1f6/run/hello_world.js";irm $_u|iex'
```
<!-- function u { echo 'https://raw.githubusercontent.com/jeff-hykin/universify/dd7d62280a582db00311e1cacff7460816204a4e/run/hello_world.js'; }
function iex { alias irm='curl -fsSL $_u|sh;:';iex(){ cat;};eval export ${1#?};};iex '$_u="https://raw.githubusercontent.com/jeff-hykin/universify/eae24c36f943428640671c54949264a79c71e1f6/run/hello_world.js";irm $_u|iex'
function iex { alias irm='curl -fsSL $_u|sh;:';t=${1#?};eval export ${t%|*};};iex '$_u="https://raw.githubusercontent.com/jeff-hykin/universify/eae24c36f943428640671c54949264a79c71e1f6/run/hello_world.js";irm $_u|iex'
function iex { irm(){ curl -fsSL $_u|sh; } irm=';:';iex(){ cat;};eval export ${1#?};};iex '$_u="https://raw.githubusercontent.com/jeff-hykin/universify/eae24c36f943428640671c54949264a79c71e1f6/run/hello_world.js";irm $_u|iex'
function iex { alias irm='curl -fsSL $_u|sh';iex(){ cat;};eval ${1#?};};iex '$_u="https://raw.githubusercontent.com/jeff-hykin/universify/dd7d62280a582db00311e1cacff7460816204a4e/run/hello_world.js";irm $_u|iex'
function irm { alias iex=:;curl -fsSL "$1"|_u="$(u)" sh;};iex "$(irm "$(iex '$_u=')")"
function iex { irm () {  }; }; iex "iex ''; $(irm "$(iex '$_u=')")"

function u { echo 'https://raw.githubusercontent.com/jeff-hykin/universify/dd7d62280a582db00311e1cacff7460816204a4e/run/hello_world.js'; };function iex { curl -fsSL "$1" | _u="$1" sh; };
`echo \`echo echo hi\` `
: `export _u=$(u);curl -fsSL "$_u" | sh`;
'$Env:_u=$(u);irm "$(u)"|iex'

$Env:_u=$(u) || export _u=$(u); irm "$(u)"|iex || clear;curl -fsSL "$_u" | sh

```sh
function u { echo 'https://raw.githubusercontent.com/jeff-hykin/universify/dd7d62280a582db00311e1cacff7460816204a4e/run/hello_world.js'; };$Env:_u=$(u) || export _u=$(u); irm "$(u)"|iex || clear;curl -fsSL "$_u" | sh
``` -->

# Part 7: Universify Your Scripts

Wouldn't it be great if anyone could:
1. Write a Deno script (including lots of bash-like tooling/syntax)
2. Run a CLI command with preferences (Deno version, stability flags, permissions for npm modules, etc)
3. Get both a universal .ps1 file and (if in a github repo) a command for running the file remotely.

Well that's exactly what [universify](https://github.com/jeff-hykin/universify) does, including escaping any coincidental `#>` usage.

Example `your_script.ts`:

```ts
import $ from "https://esm.sh/@jsr/david__dax@0.43.2/mod.ts"
import { globSync } from "node:fs"

await $`echo Hello World`
await $`echo dax makes JS as easy as writing bash`
await $`echo piping works > output.txt`
await $`echo common stuff like cp, mv, mkdir, and pipes are cross platform (not child processes)`
await $`echo child processes work too | grep 'like me' | wc -l`
await $`echo go give dax a star. I didn't write it: https://github.com/dsherret/dax`

await $`rm -rf dist/`
await $`mkdir -p logs/`
await $`touch logs/log.txt`
await $`cat old_logs/log.txt`;  // const content = await $`old_logs/log.txt`.text()
await $`cp old_logs/log.txt logs/log.txt`
await $`sleep 5`
await $`which ffmpeg`
await $`pwd`
await $`exit`

const color = prompt("Whats your favorite color?")

if (confirm(`Run tests?`)) {
    for (let each of globSync`tests/**/*.js`) {
        await $`echo Running ${each}`
        await $`deno run -A ${each}`
        const outputAsString = await $`deno run -A ${each}`.text()
    }
}
```

To make it run anywhere:

1. Install Universify<br>
```sh
# install deno if you don't have it
irm https://deno.land/install.ps1 | iex || curl -fsSL https://deno.land/install.sh | sh
# install universify
deno install -n uni -Afgr https://raw.githubusercontent.com/jeff-hykin/universify/master/main/universify.js
```

2. Convert your script<br>
```sh
uni ./your_script.ts --deno-version 2.4.3
```

3. Run your script<br>
```sh
# run locally 
./your_script 

# run remotely (replace the URL with your own)
function u { echo 'https://raw.githubusercontent.com/GITHUB_USERNAME/REPO_NAME/BRANCH_NAME_TAG_NAME_OR_COMMIT_HASH/PATH_TO_THIS_SCRIPT'; };$Env:_u=$(u) || export _u=$(u); irm "$(u)"|iex || clear;curl -fsSL "$_u" | sh
```

# Part 8: More To The Story

I left a lot of details out to make sure everyone could see the good parts. If you have your own cursed projects, enjoyed this post, or want to know what got left out don't hesitate to say hello. I'm an AI Robotics PhD Student at Texas A&M. You can find me on [Lemmy](https://lemmy.world/u/jeff_hykin), [Telegram](https://t.me/jeff_hykin),  [Discord](discordapp.com/users/266399494793330689), [Email](mailto:jeff.hykin+uni@gmail.com), or [Github](https://github.com/jeff-hykin/universify).

# Part 9: Everything Else: Security & Caveats

Oh yeah, security. You should really stop running code from internet strangers. Checkout the extensive [how do I verify this isn't malicious](https://github.com/jeff-hykin/universify?tab=readme-ov-file#how-do-i-verify-this-isnt-malicious) section on the universify repo.

Technicalities. Alright trolls, lets get this over with. This is the section I get to link to in reply to all the inevitable "umm actually" comments. 
1. Side effects / Reliability / Isolation
    1. Okay, there is actually a relevant side effect that has come to bite me, but not for the reason one might think (and I've also already mitigated by default in `universify`). If running a script deno will check for a lock file in parent directories. If in a project that is using a newer version of Deno, the lock file version could be higher, and the script would be unable to parse it. I hit this a few times coming from Deno 1.x to Deno 2.x, but its fully mitigated with the `--no-lock` flag which is added by default anytime someone uses universify. Similar story for config files, which is why `--no-config` is also included by default. You can include your own lock/config with `--lock=` and `--config`. There can be similar issues with `node_modules` and `package.json` files, set `DENO_NO_PACKAGE_JSON=true` in the powershell/bash environment to avoid those entirely.
    2. Deno defaults to a shared cache for https modules `$HOME/.cache/deno` (or `$XDG_CACHE_HOME/deno` or `$HOME/Library/Caches/deno` or `C:\Users\USERNAME\AppData\Local\deno\ `). This cache isn't anything nearly as problematic as a python or ruby cache because its done in a nice address-based way. However, there can be problems in two ways. First is a very rare issue. Deno does integrity checks. Sometimes these checks fail, I believe (possibly) because of different ways the checks were calculated across versions. Adding `--no-code-cache` is one way to get around this problem, adding `--reload` is another way, however I don't recommend either. If you really want to avoid conflict, set `DENO_DIR` env var to where ever you'd like to keep a cache. The second issue is also rare and probably only because of the Deno 1.x to 2.x change. Deno keeps track of caches with a big (I think) sql lite file. When using a really large range of deno versions on the same cache, there can be incompatibilities on that database. Again, set `DENO_DIR` to avoid this issue.
    3. Technically Deno is not a standalone executable because it depends on libc. **And this actually matters** because it is why the Deno executable fails on Alpine Linux, and MacOS Mojave (and older). I'm waiting for a statically linked libc version, maybe one day we'll get it.
    4. Yeah, putting something in the user's home directory (e.g. universify's choice of `$HOME/.deno/$deno_version`) is a side effect. Storing everything in a tmp folder is completely possible. You're welcome to bug me about adding a CLI option if you really want there to be no side effects. It will very inefficient, as you will probably also want to use `--no-code-cache`, `--no-lock`, `--no-config`, `--quiet`, `--no-npm`, set `DENO_DIR` to a tmp folder, and set `DENO_NO_PACKAGE_JSON=true` for absolute stand-alone-ness.
2. Running local scripts. There's technically two files generated, not just a .ps1 file. I explain why at the [bottom of this section](https://github.com/jeff-hykin/universify?tab=readme-ov-file#how-do-i-make-my-own-universal-installer-script) in the readme.