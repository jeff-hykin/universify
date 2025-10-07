#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function getDenoVersion{<#${/*'>/dev/null )` 2>/dev/null;getDenoVersion() { #>
        echo "2.5.3"; : --% ' |out-null <#';
    };
    # getDenoVersion (above) exists as both a bash and powershell function so that DENO_VERSION_HERE is only mentioned in one place (easy to hand-edit)
    # NOTE: semicolons at the end of lines are important for when this script is automatically crushed into a few lines
    DENO_INSTALL="$HOME/.deno/$(getDenoVersion)";
    deno_version="v$(getDenoVersion)";
    deno="$DENO_INSTALL/bin/deno";
    target_script="$0";
    disable_url_run="";
    
    # if using the universal one-liner runner, e.g. 
    #         function iex { alias irm='curl -fsSL $url_|sh;:';t=${1#?};eval export ${t%|*};};iex '$url_="URL_TO_THAT_FILE";irm $url_|iex'
    # then the u env var will be set, and we NEED that env var because
    # $0 will NOT be the path to this script, because there is no path to this script in that case 
    # (the script wouldn't be a downloaded file, its just running inline as the output of curl)
    # so if that var is set, that becomes the new target_script
    if [ -n "$url_" ] && [ -z "$disable_url_run" ];then
        # if no http, then add https://
        if [ "${url_#http}" = "$url_" ]; then
            url_="https://$url_";
        fi;
        target_script="$url_";
    fi;
    
    # 
    # try to run immediately
    # 
    if [ -x "$deno" ];then 
        exec "$deno" run -A -q --no-lock --no-config "$target_script" "$@"; 
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
    exec "$deno" run -A -q --no-lock --no-config "$0" "$@";

    # 
    # powershell portion
    # 
#>};
    $DenoInstall = "${HOME}/.deno/$(getDenoVersion)";
    $BinDir = "$DenoInstall/bin";
    $DenoExe = "$BinDir/deno.exe";
    $TargetScript = "$PSCommandPath";
    $DisableUrlRun = "";
    
    # if using the universal one-liner runner, e.g. 
    #          function iex { alias irm='curl -fsSL $url_|sh;:';t=${1#?};eval export ${t%|*};};iex '$url_="URL_TO_THAT_FILE";irm $url_|iex'
    # then the u env var will be set, and we NEED that env var because
    # $0 will NOT be the path to this script, because there is no path to this script in that case 
    # (the script wouldn't be a downloaded file, its just running inline as the output of curl)
    # so if that var is set, that becomes the new target_script
    if ($url_ -and -not($DisableUrlRun)) {
        # if no http, then add https://
        if (-not($url -match '^http')) {
            $url_="https://$url_";
        }
        $TargetScript = "$url_";
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
    }; & "$DenoExe" run -A -q --no-lock --no-config "$TargetScript" @args; Exit $LastExitCode; <#
# */0}`;

    console.log("Hello World")
    
// #>