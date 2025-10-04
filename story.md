# The World's First Universal Script
#### By Jeff Hykin ([Telegram](https://t.me/jeff_hykin), [Discord](discordapp.com/users/266399494793330689), [Email](mailto:jeff.hykin+uni@gmail.com))
<br>
Windows comes with Powershell/CMD. Minimal Linux and MacOS come with bash/zsh/dash/sh. So there is no unified script that runs out-of-the-box all major systems... right?
<br><br>
Allow me to guide you down the rabbit hole.<br>Not only is it possible, it can be practical and useful.

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

So how does the party trick above help us get to the true universal script? The next logical step would be to try bootstrapping either bash or powershell, making one of those run on the other system(s), thereby making it (bash or powershell) the world's first universal scripting language. That would be the next logical step. In fact the only other option would be to add another language. That would mean every line of the file would need to be valid bash, valid powershell, and valid as some third language. And there is no *practical* way to do that. Right?

# Part 2: Cramming in a 3rd Language

When it comes to programming syntax, we as programmers have a lot of choice: indent-based Python, end-based Ruby, C-style languages, ~~Haskell~~ Elixir. For a universal script we could even use Zig, Go, or Rust by simply running the code immediately after compiling ([Rust supports shebangs by the way](https://stackoverflow.com/a/41325202/4367134)). How many of those languages have a syntax that is compatible with bash and powershell?

I don't know. Thankfully it doesn't matter. The universal script only needs one more language. 

So why I am beating around the bush?

The truth is the world's first universal script could only ever be one language. Maybe it is dawning on you what I am about to say. We can claim it didn't have to be this way -- there must be another syntax. Maybe there is. But deep down you and I know it was fate.<br>
The language no programmer can truly escape.<br>
The language destined from birth to rule over all languages.<br>
The language that crashes iPhones, CloudFlare, Teslas, and homemade websites alike.<br>
<br>
I'm, of course, talking about:<br>


![javascript_i_love_it](https://github.com/user-attachments/assets/1c2779a6-bbce-480e-9abf-ee61c3235403)


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
3. While the script can easily run itself, there is a minor problem and at least two catastrophic problems. These are, respectively, the JavaScript runtime, the JavaScript runtime, and finally the JavaScript runtime.

# Part 3: Heinous Reliability

For those ahead of the curve, the minor issue might be obvious; that our victi -- I mean the host system -- is not guaranteed to have a JavaScript runtime at all. With a mix of dread, excitement, and guilt please consider the following. What if we just crammed the entire NodeJS installer -- both the bash installer and powershell installer -- into the file? Meaning, when the script tries to run itself, if the host doesn't have NodeJS, then the script *just gets NodeJS for them*.

Before the implications of such a diabolical Rube Goldberg machine sink in, we must look at the first catastrophic problem. Which can be summarized as:
1. The world's first universal script should be reliable. 
2. We just installed NodeJS.

Can those things coexist? Can the entire NodeJS installer(s) be crammed into one file?

I don't know.

The script may already be an abomination, but even my hacks have standards. Instead of using NodeJS in the year of our lord 2025, we could consider a sane JS runtime, like Deno.

# Part 4: What about Npm Packages?

This brings us to the second catastrophe:
1. The world's first universal script should have no side effects.
2. Everybody knows JavaScript is useless without modules.

How is a universal script supposed to figure out if a number is even or odd without modules? The world may never know because it happens that Deno not only supports everyone's favorite malware, but does so without an `install` command, bundling, or a `node_modules` side effect. For reliability and security, if you're into that sort of thing, it can also easily pin versions:

```js
import supplyChainAttack from "https://esm.sh/chalk"
import chalk from "https://esm.sh/chalk@5.6.2"
import isEven from "https://esm.sh/is-even@1.0.0"
console.log(isEven(2)) // true
```

Returning to the previous question: can the bash installer and powershell installer for Deno be crammed into a single file? What about installer side effects? All installers have side effects. Thankfully, Deno's installer is 1000 lines shorter than Node's, and Deno can run as a standalone binary. For reliability and avoiding side effects, we can modify the scripts to put a specific version of Deno into an isolated folder. Once that version of Deno has been downloaded, the script runs itself with that executable.

And voila, the entire (slightly modified) 116-line bash installer and 52-line powershell installer for Deno as one universal script:

```js
#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function getDenoVersion{<#${/*'>/dev/null )` 2>/dev/null;getDenoVersion() { #> echo "DENO_VERSION_HERE"; : --% ' |out-null <#'; }; deno_version="$(getDenoVersion)"; deno="$HOME/.deno/$deno_version/bin/deno"; target_script="$0"; disable_url_run="DISABLE_URL_RUN_HERE";  if [ -n "$_u" ] && [ -z "$disable_url_run" ]; then target_script="$_u"; fi; if [ -x "$deno" ];then  exec "$deno" run UNIX_DENO_ARGS_HERE "$target_script" "$@";  elif [ -f "$deno" ]; then  chmod +x "$deno" && exec "$deno" run UNIX_DENO_ARGS_HERE "$target_script" "$@"; fi; has () { command -v "$1" >/dev/null; };  set -e;  if ! has unzip && ! has 7z; then echo "Can I try to install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" =~ ^[Yy] ]; then  if ! has brew; then  brew install unzip; elif has apt-get; then if [ "$(whoami)" = "root" ]; then  apt-get install unzip -y; elif has sudo; then  echo "I'm going to try sudo apt install unzip";read ANSWER;echo;  sudo apt-get install unzip -y;  elif has doas; then  echo "I'm going to try doas apt install unzip";read ANSWER;echo;  doas apt-get install unzip -y;  else apt-get install unzip -y;  fi;  fi;  fi;   if ! has unzip; then  echo ""; echo "So I couldn't find an 'unzip' command"; echo "And I tried to auto install it, but it seems that failed"; echo "(This script needs unzip and either curl or wget)"; echo "Please install the unzip command manually then re-run this script"; exit 1;  fi;  fi;   if ! has unzip && ! has 7z; then echo "Error: either unzip or 7z is required to install Deno (see: https://github.com/denoland/deno_install#either-unzip-or-7z-is-required )." 1>&2; exit 1; fi;  if [ "$OS" = "Windows_NT" ]; then target="x86_64-pc-windows-msvc"; else case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; "Linux aarch64") target="aarch64-unknown-linux-gnu" ;; *) target="x86_64-unknown-linux-gnu" ;; esac fi;  print_help_and_exit() { echo "Setup script for installing deno  Options: -y, --yes Skip interactive prompts and accept defaults --no-modify-path Don't add deno to the PATH environment variable -h, --help Print help " echo "Note: Deno was not installed"; exit 0; };  for arg in "$@"; do case "$arg" in "-h") print_help_and_exit ;; "--help") print_help_and_exit ;; "-"*) ;; *) if [ -z "$deno_version" ]; then deno_version="$arg"; fi ;; esac done; if [ -z "$deno_version" ]; then deno_version="$(curl -s https://dl.deno.land/release-latest.txt)"; fi;  deno_uri="https://dl.deno.land/release/v${deno_version}/deno-${target}.zip"; deno_install="${DENO_INSTALL:-$HOME/.deno/$deno_version}"; bin_dir="$deno_install/bin"; exe="$bin_dir/deno";  if [ ! -d "$bin_dir" ]; then mkdir -p "$bin_dir"; fi;  if has curl; then curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri"; elif has wget; then wget --output-document="$exe.zip" "$deno_uri"; else echo "Error: curl or wget is required to download Deno (see: https://github.com/denoland/deno_install )." 1>&2; fi;  if has unzip; then unzip -d "$bin_dir" -o "$exe.zip"; else 7z x -o"$bin_dir" -y "$exe.zip"; fi; chmod +x "$exe"; rm "$exe.zip";  exec "$deno" run UNIX_DENO_ARGS_HERE "$0" "$@";       #>}; $DenoInstall = "${HOME}/.deno/$(getDenoVersion)"; $BinDir = "$DenoInstall/bin"; $DenoExe = "$BinDir/deno.exe"; $TargetScript = "$PSCommandPath"; $DisableUrlRun = "DISABLE_URL_RUN_HERE";  if ($Env:_u -and $DisableUrlRun) { $TargetScript = "$Env:_u"; };  if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir/deno.zip"; $DenoUri = "https://github.com/denoland/deno/releases/download/v$(getDenoVersion)/deno-x86_64-pc-windows-msvc.zip";  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;  if (!(Test-Path $BinDir)) { New-Item $BinDir -ItemType Directory | Out-Null; };  Function Test-CommandExists { Param ($command); $oldPreference = $ErrorActionPreference; $ErrorActionPreference = "stop"; try {if(Get-Command "$command"){RETURN $true}} Catch {Write-Host "$command does not exist"; RETURN $false}; Finally {$ErrorActionPreference=$oldPreference}; };  if (Test-CommandExists curl) { curl -Lo $DenoZip $DenoUri; } else { curl.exe -Lo $DenoZip $DenoUri; };  if (Test-CommandExists curl) { tar xf $DenoZip -C $BinDir; } else { tar -Lo $DenoZip $DenoUri; };  Remove-Item $DenoZip;   }; & "$DenoExe" run DENO_WINDOWS_ARGS_HERE "$TargetScript" @args; Exit $LastExitCode; <# # */0}`;
console.log("Hello World") // #>
```

Well that is the collapsed version, the expanded version is:

```js
#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function getDenoVersion{<#${/*'>/dev/null )` 2>/dev/null;getDenoVersion() { #>
        echo "2.5.3"; : --% ' |out-null <#';
    };
    # getDenoVersion exists as both a bash and powershell function so that 2.5.3 is only mentioned in one place (no duplication)
    deno_version="$(getDenoVersion)";
    deno="$HOME/.deno/$deno_version/bin/deno";
    target_script="$0";
    disable_url_run="";
    if [ -n "$_u" ] && [ -z "$disable_url_run" ]; then
        target_script="$_u";
    fi;
    # 
    # try to run itself immediately
    # 
    if [ -x "$deno" ];then 
        exec "$deno" run -A "$target_script" "$@"; 
    # if not executable, try to make it executable then run ASAP
    elif [ -f "$deno" ]; then 
        chmod +x "$deno" && exec "$deno" run -A "$target_script" "$@";
    fi;
    
    # 
    # if the user doesn't have the exact deno version, install it to an isolated folder
    # 
    has () {
        command -v "$1" >/dev/null;
    }; 
    set -e;
    
    # basically all systems have unzip, but as a fallback for reliability or minimal docker containers
    if ! has unzip && ! has 7z; then
        echo "Can I try to install unzip for you? (it is required for this command to work) ";read ANSWER;echo; 
        if [ "$ANSWER" =~ ^[Yy] ]; then 
            if ! has brew; then # brew can exist on linux
                brew install unzip;
            elif has apt-get; then
                if [ "$(whoami)" = "root" ]; then 
                    apt-get install unzip -y;
                elif has sudo; then 
                    echo "I'm going to try sudo apt install unzip";read ANSWER;echo; 
                    sudo apt-get install unzip -y; 
                elif has doas; then 
                    echo "I'm going to try doas apt install unzip";read ANSWER;echo; 
                    doas apt-get install unzip -y; 
                else apt-get install unzip -y; 
                fi; 
            fi; 
        fi; 
        
        # if still doesn't have unzip somehow
        if ! has unzip; then 
            echo "";
            echo "So I couldn't find an 'unzip' command";
            echo "And I tried to auto install it, but it seems that failed";
            echo "(This script needs unzip and either curl or wget)";
            echo "Please install the unzip command manually then re-run this script";
            exit 1; 
        fi; 
    fi;
    
    
    if ! has unzip && ! has 7z; then
        echo "Error: either unzip or 7z is required to install Deno (see: https://github.com/denoland/deno_install#either-unzip-or-7z-is-required )." 1>&2;
        exit 1;
    fi;

    if [ "$OS" = "Windows_NT" ]; then
        target="x86_64-pc-windows-msvc";
    else
        case $(uname -sm) in
        "Darwin x86_64") target="x86_64-apple-darwin" ;;
        "Darwin arm64") target="aarch64-apple-darwin" ;;
        "Linux aarch64") target="aarch64-unknown-linux-gnu" ;;
        *) target="x86_64-unknown-linux-gnu" ;;
        esac
    fi;

    print_help_and_exit() {
        echo "Setup script for installing deno

    Options:
    -y, --yes
        Skip interactive prompts and accept defaults
    --no-modify-path
        Don't add deno to the PATH environment variable
    -h, --help
        Print help
    "
        echo "Note: Deno was not installed";
        exit 0;
    };

    # Simple arg parsing - look for help flag, otherwise
    # ignore args starting with '-' and take the first
    # positional arg as the deno version to install
    for arg in "$@"; do
        case "$arg" in
        "-h")
            print_help_and_exit
            ;;
        "--help")
            print_help_and_exit
            ;;
        "-"*) ;;
        *)
            if [ -z "$deno_version" ]; then
                deno_version="$arg";
            fi
            ;;
        esac
    done;
    if [ -z "$deno_version" ]; then
        deno_version="$(curl -s https://dl.deno.land/release-latest.txt)";
    fi;

    deno_uri="https://dl.deno.land/release/v${deno_version}/deno-${target}.zip";
    deno_install="${DENO_INSTALL:-$HOME/.deno/$deno_version}";
    bin_dir="$deno_install/bin";
    exe="$bin_dir/deno";

    if [ ! -d "$bin_dir" ]; then
        mkdir -p "$bin_dir";
    fi;
    
    if has curl; then
        curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri";
    elif has wget; then
        wget --output-document="$exe.zip" "$deno_uri";
    else
        echo "Error: curl or wget is required to download Deno (see: https://github.com/denoland/deno_install )." 1>&2;
    fi;
    
    if has unzip; then
        unzip -d "$bin_dir" -o "$exe.zip";
    else
        7z x -o"$bin_dir" -y "$exe.zip";
    fi;
    chmod +x "$exe";
    rm "$exe.zip";
    
    exec "$deno" run -A "$0" "$@";
    
    
    # commented out below because we don't want to modify the user's env/path (no side effects)
    
    # echo "Deno was installed successfully to $exe";

    # run_shell_setup() {
    #     "$exe" run -A --reload "https://esm.sh/jsr/@deno/installer-shell-setup@0.3.1/bundled.esm.js" --yes --no-modify-path "$deno_install" "$@";
    # };

    # # If stdout is a terminal, see if we can run shell setup script (which includes interactive prompts)
    # if [ -z "$CI" ] && [ -t 1 ] && $exe eval 'const [major, minor] = Deno.version.deno.split("."); if (major < 2 && minor < 42) Deno.exit(1)'; then
    #     if [ -t 0 ]; then
    #         run_shell_setup "$@";
    #     else
    #         # This script is probably running piped into sh, so we don't have direct access to stdin.
    #         # Instead, explicitly connect /dev/tty to stdin
    #         run_shell_setup "$@" </dev/tty;
    #     fi
    # fi;
    # if command -v deno >/dev/null; then
    #     echo "Run 'deno --help' to get started";
    # else
    #     echo "Run '$exe --help' to get started";
    # fi;
    # echo;
    # echo "Stuck? Join our Discord https://discord.gg/deno";

    # 
    # powershell portion
    # 
#>};
    $DenoInstall = "${HOME}/.deno/$(getDenoVersion)";
    $BinDir = "$DenoInstall/bin";
    $DenoExe = "$BinDir/deno.exe";
    $TargetScript = "$PSCommandPath";
    $DisableUrlRun = "";
    if ($Env:_u -and $DisableUrlRun) {
        $TargetScript = "$Env:_u";
    };
    
    # if deno isn't installed, install it to an isolated folder
    if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) {
        $DenoZip = "$BinDir/deno.zip";
        $DenoUri = "https://github.com/denoland/deno/releases/download/v$(getDenoVersion)/deno-x86_64-pc-windows-msvc.zip";

        # GitHub requires TLS 1.2
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;

        if (!(Test-Path $BinDir)) {
            New-Item $BinDir -ItemType Directory | Out-Null;
        };
        
        Function Test-CommandExists {
            Param ($command);
            $oldPreference = $ErrorActionPreference;
            $ErrorActionPreference = "stop";
            try {if(Get-Command "$command"){RETURN $true}}
            Catch {Write-Host "$command does not exist"; RETURN $false};
            Finally {$ErrorActionPreference=$oldPreference};
        };
        
        if (Test-CommandExists curl) {
            curl -Lo $DenoZip $DenoUri;
        } else {
            curl.exe -Lo $DenoZip $DenoUri;
        };
        
        if (Test-CommandExists curl) {
            tar xf $DenoZip -C $BinDir;
        } else {
            tar -Lo $DenoZip $DenoUri;
        };
        
        Remove-Item $DenoZip;
        
        # commented out below because we don't want to modify the user's path (no side effects)
        
        # $User = [EnvironmentVariableTarget]::User;
        # $Path = [Environment]::GetEnvironmentVariable('Path', $User);
        # if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) {
        #     [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User);
        #     $Env:Path += ";$BinDir";
        # }
    }; & "$DenoExe" run DENO_WINDOWS_ARGS_HERE "$TargetScript" @args; Exit $LastExitCode; <#
# */0}`;

    console.log("Hello World")
    
// #>
```

# Part 5: Going Beyond: Remote Scripts

Running a script locally is one thing, but installers are often remotely executed. For example the deno installer says:
1. Windows users run `irm https://deno.land/install.ps1 | iex`
2. Linux/MacOS users run `curl -fsSL https://deno.land/install.sh | sh`

What if we could just have one command? I'll spare the details, but the following should be worlds first truly universal remote script:

```sh
function u { echo 'https://raw.githubusercontent.com/jeff-hykin/universify/e1d08f8875b9bebf037e8e1c6e8822a3b5c0b9ea/run/hello_world.js'; };$Env:_u=$(u) || export _u=$(u); irm "$(u)"|iex || clear;curl -fsSL "$_u" | sh
```


# Part 6: Instantly Universify Your Own Scripts

This is getting kind of long, so lets jump to the end. 
1. Write your own normal Deno script
2. Run a CLI command with your preferences (Deno version, stability flags, permissions (for npm modules), etc)
3. Voila, your very own universal script; both a .ps1 file that runs anywhere, and (if its part of a github repo) a command for running the file remotely.

Example `your_script.ts`:

```ts
import $ from "https://esm.sh/@jsr/david__dax@0.43.2/mod.ts"
import { globSync } from "node:fs"

await $`echo Hello World`
await $`echo dax makes JS as easy as writing bash`
await $`echo piping works > output.txt`
await $`echo common stuff like cp, mv, mkdir, and pipes are cross platform (not child processes)`
await $`echo go give it a star. I didn't write dax: https://github.com/dsherret/dax`
await $`echo child processes work too | grep 'like me' | wc -l`

await $`rm -rf dist/`
await $`mkdir -p logs/`
await $`touch logs/log.txt`
await $`cat old_logs/log.txt`;  // const content = await $`old_logs/log.txt`.text()
await $`cp old_logs/log.txt logs/log.txt`
await $`sleep 5`
await $`which ffmpeg`
await $`pwd`
await $`exit`

// combine JS with shell stuff
for (let each of globSync`tests/**/*.js`) {
    await $`echo Running ${each}`
    await $`deno run -A ${each}`
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

# Part 7: Everything Else!

If you enjoyed this, have your own cursed projects, or want to know more, reach out on [Telegram](https://t.me/jeff_hykin) or [Discord](discordapp.com/users/266399494793330689), email jeff.hykin+uni@gmail.com or checkout the [Universify repo](https://github.com/jeff-hykin/universify).

Oh yeah, security. Security is important. Checkout the [how do I verify this isn't malicious](https://github.com/jeff-hykin/universify?tab=readme-ov-file#how-do-i-verify-this-isnt-malicious) on the universify repo.
