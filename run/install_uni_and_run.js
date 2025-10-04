#!/usr/bin/env -S deno run --allow-all
import $ from "https://esm.sh/@jsr/david__dax@0.43.2/mod.ts"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.8.4/main/file_system.js"
const $$ = (...args) => $(...args).noThrow()
// await $$`false`
// (await $$`false`).code
// await $$`false`.text("stderr")
// await $$`false`.text("combined")
// await $$`echo`.stdinText("yes\n")

let didntHaveDenoGlobally = false
if (!await $.which("deno")) {
    didntHaveDenoGlobally = true
    const result = await $.confirm({
        message: "Is it okay if I install deno onto your system?",
        default: true,
    })
    if (result) {
        if (Deno.build.os == "windows") {
            await $`irm https://deno.land/install.ps1 | iex`
        } else {
            await $`curl -fsSL https://deno.land/install.sh | sh`
        }
    } else {
        console.log(`okay, well I need deno to run uni so come back when you're ready`)
        Deno.exit(0)
    }
}

if (!await $.which("uni")) {
    const result = await $.confirm({
        message: "Want me to install uni for you?",
        default: true,
    })
    if (result) {
        await $`curl -fsSL https://raw.githubusercontent.com/jeff-hykin/universify/master/main/universify.js | sh`
    } else {
        console.log(`okay, well I need to install uni to use it so come back when you're ready`)
        Deno.exit(0)
    }
}

console.log(`Okay, you're ready to use uni\nTry running:\n      uni ./your_script.js`)
if (didntHaveDenoGlobally) {
    // start a sub shell where uni is active and part of the path
    Deno.env.set("PATH",`${Deno.env.get("PATH")}:${FileSystem.home}/.deno/bin/uni`)
    if (Deno.build.os == "windows") {
        await $`pwsh`
    } else {
        await $`${Deno.env.get("SHELL")}`
    }
}
