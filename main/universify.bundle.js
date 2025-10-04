var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// https://deno.land/x/quickr@0.8.4/main/operating_system.js
var cache = {};
var stdoutRun = async (args2) => {
  const process = Deno.run({ cmd: args2, stdout: "piped", stderr: "piped" });
  const output2 = await process.output();
  return new TextDecoder().decode(output2).replace(/\n$/, "");
};
var OperatingSystem = {
  commonChecks: {
    isMac: Deno.build.os == "darwin",
    isWindows: Deno.build.os == "windows",
    isLinux: Deno.build.os == "linux",
    get isWsl() {
      if (cache.isWsl != null) {
        return cache.isWsl;
      }
      if (!(OperatingSystem.commonChecks.isMac || OperatingSystem.commonChecks.isWindows)) {
        if (Deno.env.get("WSLENV")) {
          return cache.isWsl = true;
        }
        try {
          const { isFile } = Deno.lstatSync("/mnt/c");
          return cache.isWsl = true;
        } catch (error) {
        }
      }
      return cache.isWsl = false;
    }
  },
  commonName: {
    "darwin": "MacOS",
    "windows": "Windows",
    "linux": "Linux"
  }[Deno.build.os],
  kernel: {
    commonName: Deno.build.os
  },
  architecture: Deno.build.architecture,
  get versionArray() {
    return new Promise(async (resolve7, reject) => {
      let versionArray = [];
      if (OperatingSystem.commonChecks.isWindows) {
        try {
          const windowsVersionString = await stdoutRun(["pwsh", "-Command", `[System.Environment]::OSVersion.Version`]);
          versionArray = windowsVersionString.replace(/^[\w\W]*?(\d+\.\d+\.\d+)[\w\W]*/, "$1").split(".").map((each2) => each2 - 0);
        } catch (error) {
          console.warn(`unable to get version string for Windows: ${error.message}`);
        }
      } else if (OperatingSystem.commonChecks.isMac) {
        try {
          const macVersionString = await stdoutRun(["/usr/bin/sw_vers", "-productVersion"]);
          versionArray = macVersionString.replace(/^[\w\W]*?(\d+\.\d+(\.\d+)?)[\w\W]*/, "$1").split(".").map((each2) => each2 - 0);
        } catch (error) {
          console.warn(`unable to get version string for MacOS: ${error.message}`);
        }
      } else {
        try {
          const outputString = await stdoutRun(["uname", "-r"]);
          versionArray = outputString.replace(/^[\w\W]*?((\d+\.)+\d+)[\w\W]*/, "$1").split(".").map((each2) => each2 - 0);
        } catch (error) {
          console.warn(`unable to get version string for Linux: ${error.message}`);
        }
      }
    });
  },
  get username() {
    if (!cache.username) {
      if (Deno.build.os != "windows") {
        cache.username = Deno.env.get("USER");
      } else {
        cache.username = Deno.env.get("USERNAME");
      }
    }
    return cache.username;
  },
  get home() {
    if (!cache.home) {
      if (Deno.build.os != "windows") {
        cache.home = Deno.env.get("HOME");
      } else {
        cache.home = Deno.env.get("HOMEPATH");
      }
    }
    return cache.home;
  },
  async idForUsername(username) {
    if (OperatingSystem.commonChecks.isMac) {
      if (!cache.macOsUserToUid) {
        const userListString = await stdoutRun(["dscl", ".", "-list", "/Users", "UniqueID"]);
        const userList = userListString.split(/\n/);
        const userNamesAndIds = userList.map((each2) => {
          const match = each2.match(/(.+?)(-?\d+)$/, "$1");
          if (match) {
            const username2 = match[1].trim();
            const uid2 = match[2];
            return [username2, uid2];
          }
        }).filter((each2) => each2);
        const idsAndUsernames = userNamesAndIds.map(([username2, id]) => [id, username2]);
        cache.macOsUserToUid = Object.fromEntries(userNamesAndIds);
        cache.macOsUidToUser = Object.fromEntries(idsAndUsernames);
      }
      return cache.macOsUserToUid[username];
    } else if (OperatingSystem.commonChecks.isWindows) {
      return await stdoutRun(["pwsh", "-Command", `Get-ADUser -Identity '${username.replace(/'/, "''")}' | select SID`]);
    } else if (OperatingSystem.commonChecks.isLinux) {
      return await stdoutRun(["id", "-u", OperatingSystem.username]);
    }
  },
  async openUrl(url) {
    if (Deno.build.os == "darwin") {
      const command = new Deno.Command("open", {
        args: [url]
      });
      return await command.output();
    } else if (Deno.build.os == "windows") {
      const command = new Deno.Command("powershell", {
        args: ["Start-Process", url]
      });
      return await command.output();
    } else if (Deno.build.os == "linux") {
      const command = new Deno.Command("xdg-open", {
        args: [url]
      });
      return await command.output();
    } else {
      throw new Error(`Unsupported OS: ${Deno.build.os}`);
    }
  }
};

// https://esm.sh/gh/jeff-hykin/good-js@f6d5bcb/denonext/source/string.mjs
var P = function* () {
}();
P.length = 0;
var Y = (u3) => {
  if (typeof u3?.next == "function") return u3;
  if (u3 == null) return P;
  if (typeof u3[Symbol.iterator] == "function") {
    let D3 = u3[Symbol.iterator]();
    return Number.isFinite(D3?.length) || (Number.isFinite(u3?.length) ? D3.length = u3.length : Number.isFinite(u3?.size) && (D3.length = u3.size)), D3;
  } else if (typeof u3[Symbol.asyncIterator] == "function") {
    let D3 = u3[Symbol.asyncIterator]();
    return Number.isFinite(D3?.length) || (Number.isFinite(u3?.length) ? D3.length = u3.length : Number.isFinite(u3?.size) && (D3.length = u3.size)), D3;
  } else {
    if (typeof u3 == "function") return u3();
    if (Object.getPrototypeOf(u3).constructor == Object) {
      let D3 = Object.entries(u3), F2 = D3[Symbol.iterator]();
      return F2.length = D3.length, F2;
    }
  }
  return P;
};
var Bu = function* (...u3) {
  let D3 = u3.map(Y);
  for (; ; ) {
    let F2 = D3.map((A3) => A3.next());
    if (F2.every((A3) => A3.done)) break;
    yield F2.map((A3) => A3.value);
  }
};
var L = function(...u3) {
  let D3 = Bu(...u3), F2 = Math.max(...u3.map((A3) => typeof A3 != "function" && (typeof A3?.length == "number" ? A3?.length : A3.size)));
  return F2 == F2 && (D3.length = F2), D3;
};
var h = ({ string: u3, by: D3 = "    ", noLead: F2 = false }) => (F2 ? "" : D3) + u3.replace(/\n/g, `
` + D3);
var T = typeof globalThis?.Uint8Array != "function" ? class {
} : Object.getPrototypeOf(Uint8Array.prototype).constructor;
var R = [Uint16Array, Uint32Array, Uint8Array, Uint8ClampedArray, Int16Array, Int32Array, Int8Array, Float32Array, Float64Array];
globalThis.BigInt64Array && R.push(globalThis.BigInt64Array);
globalThis.BigUint64Array && R.push(globalThis.BigUint64Array);
var H = function(u3) {
  let D3 = [];
  if (u3 == null) return [];
  for (u3 instanceof Object || (u3 = Object.getPrototypeOf(u3)); u3; ) D3.push(Reflect.ownKeys(u3)), u3 = Object.getPrototypeOf(u3);
  return [...new Set(D3.flat(1))];
};
var nu = /^(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D])(?:[\$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*$/;
var iu = /^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])(?:[\$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])*$/;
var su = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|await|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/;
function b(u3) {
  if (typeof u3 != "string") return false;
  let D3 = u3.replace(/\\u([a-fA-F0-9]{4})|\\u\{([0-9a-fA-F]{1,})\}/g, function(t, B2, c2) {
    var i3 = parseInt(c2 || B2, 16);
    return i3 >= 55296 && i3 <= 57343 ? "\0" : String.fromCodePoint(i3);
  }), F2 = !iu.test(u3.replace(/\\u([a-fA-F0-9]{4})/g, function(t, B2) {
    return String.fromCodePoint(parseInt(B2, 16));
  }));
  var A3;
  return !((A3 = su.test(D3)) || !nu.test(D3));
}
function k(u3) {
  return typeof u3 != "string" ? false : u3.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/) ? true : b(u3);
}
var Q = Symbol.for("representation");
var uu = Symbol.for("Deno.customInspect");
var au = RegExp.prototype;
var lu = BigInt.prototype;
var cu = Date.prototype;
var fu = Array.prototype;
var pu = Set.prototype;
var gu = Map.prototype;
var xu = Object.prototype;
var mu = Error.prototype;
var yu = Promise.prototype;
var du = globalThis.URL?.prototype;
var hu = (u3) => typeof u3?.constructor == "function" && u3.constructor?.prototype == u3 && b(u3.constructor?.name);
var z = (u3) => {
  if (u3.description) {
    let D3 = u3.description;
    return Symbol.for(D3) == u3 ? `Symbol.for(${JSON.stringify(D3)})` : D3.startsWith("Symbol.") && Symbol[D3.slice(7)] ? D3 : `Symbol(${JSON.stringify(D3)})`;
  } else return "Symbol()";
};
var bu = (u3) => typeof u3 == "symbol" ? `[${z(u3)}]` : k(u3) ? u3 : JSON.stringify(u3);
var $u = Object.freeze(H(globalThis));
var j = (u3, { alreadySeen: D3 = /* @__PURE__ */ new Map(), debug: F2 = false, simplified: A3, indent: t = "    ", globalValues: B2 } = {}) => {
  Number.isFinite(t) && t >= 0 && (t = " ".repeat(Math.floor(t)));
  let c2 = { alreadySeen: D3, debug: F2, simplified: A3, indent: t }, i3 = (e, E3) => {
    let s2 = false;
    try {
      if (e === void 0) return "undefined";
      if (e === null) return "null";
      let { alreadySeen: a5, simplified: n, indent: l } = E3;
      if (e instanceof Object) if (a5.has(e)) {
        let r4 = a5.get(e);
        return r4 ?? `${String(e)} /*Self Reference*/`;
      } else a5.set(e, null);
      let f3 = Object.getPrototypeOf(e);
      if (typeof e[Q] == "function") try {
        let r4 = e[Q](E3);
        return a5.set(e, r4), r4;
      } catch (r4) {
        F2 && console.error(`calling Symbol.for("representation") method failed (skipping)
Error was: ${r4?.stack || r4}`);
      }
      if (typeof e[uu] == "function") try {
        let r4 = e[uu](E3);
        return a5.set(e, r4), r4;
      } catch (r4) {
        F2 && console.error(`calling Symbol.for("Deno.customInspect") method failed (skipping)
Error was: ${r4?.stack || r4}`);
      }
      F2 && (console.group(), s2 = true);
      let C3;
      if (typeof e == "number" || typeof e == "boolean" || f3 == au) C3 = String(e);
      else if (typeof e == "string") C3 = JSON.stringify(e);
      else if (typeof e == "symbol") C3 = z(e);
      else if (f3 == lu) C3 = `BigInt(${e.toString()})`;
      else if (f3 == cu) C3 = `new Date(${e.getTime()})`;
      else if (f3 == fu) {
        C3 = v4(e, E3);
        let r4;
        try {
          r4 = Object.keys(e).filter((o2) => !(Number.isInteger(o2 - 0) && o2 >= 0));
        } catch (o2) {
          F2 && console.error(`[toRepresentation] error checking nonIndexKeys
${o2?.stack || o2}`);
        }
        if (r4.length > 0) {
          let o2 = {};
          for (let y2 of r4) try {
            o2[y2] = e[y2];
          } catch {
          }
          Object.keys(o2).length > 0 && (C3 = `Object.assign(${C3}, ${w3(o2)})`);
        }
      } else if (f3 == pu) C3 = `new Set(${v4(e, E3)})`;
      else if (f3 == gu) C3 = `new Map(${G2(e.entries(), E3)})`;
      else if (f3 == yu) C3 = "Promise.resolve(/*unknown*/)";
      else if (f3 == du) C3 = `new URL(${JSON.stringify(e?.href)})`;
      else if (Eu(e)) {
        let r4 = m5.get(e);
        b(r4) || r4 == "eval" ? C3 = r4 : typeof r4 == "symbol" ? C3 = `globalThis[${z(r4)}]` : k(r4) ? C3 = `globalThis.${r4}` : C3 = `globalThis[${JSON.stringify(r4)}]`;
      } else if (hu(e)) {
        let r4 = e.constructor.name, o2;
        try {
          o2 = globalThis[r4]?.prototype == e;
        } catch {
        }
        o2 ? C3 = `${r4}.prototype` : n ? C3 = `${r4}.prototype /*${r4} is local*/` : C3 = `/*prototype of ${r4}*/ ${q2(e, E3)}`;
      } else if (f3 == mu && e?.constructor != globalThis.DOMException) try {
        C3 = `new Error(${JSON.stringify(e?.message)})`;
      } catch {
        C3 = `new Error(${JSON.stringify(e)})`;
      }
      else if (typeof e == "function") {
        let r4, o2, y2, d4 = () => {
          if (o2 != null) return o2;
          try {
            o2 = Function.prototype.toString.call(e);
          } catch {
          }
          return o2;
        }, N4 = () => {
          if (r4 != null) return r4;
          try {
            r4 = !!d4().match(/{\s*\[native code\]\s*}$/);
          } catch {
          }
          return r4;
        }, X = () => {
          if (y2 != null) return y2;
          try {
            y2 = e.name && d4().match(/^class\b/);
          } catch {
          }
          return y2;
        }, p3 = e.name;
        if (b(p3)) N4() ? C3 = `${p3} /*native function*/` : X() ? n ? C3 = `${p3} /*class*/` : C3 = d4() : n ? C3 = `${e.name} /*function*/` : C3 = `(${d4()})`;
        else if (X()) typeof p3 == "string" ? C3 = `/*name: ${JSON.stringify(p3)}*/ class { /*...*/ }` : n ? C3 = "class { /*...*/ }" : C3 = d4();
        else if (typeof p3 == "string" && d4().match(/^(function )?(g|s)et\b/)) {
          let g4 = p3.slice(4);
          p3[0] == "g" ? C3 = `Object.getOwnPropertyDescriptor({/*unknown obj*/},${JSON.stringify(g4)}).get` : C3 = `Object.getOwnPropertyDescriptor({/*unknown obj*/},${JSON.stringify(g4)}).set`;
        } else if (p3) if (n) if (N4()) if (p3.startsWith("get ")) {
          let g4 = p3.slice(4);
          Object.getOwnPropertyDescriptor(globalThis, g4)?.get == e ? C3 = `Object.getOwnPropertyDescriptor(globalThis, ${JSON.stringify(g4)}).get /*native getter*/` : C3 = `Object.getOwnPropertyDescriptor({/*unknown obj*/}, ${JSON.stringify(g4)}).get`;
        } else if (p3.startsWith("set ")) {
          let g4 = p3.slice(4);
          Object.getOwnPropertyDescriptor(globalThis, g4)?.set == e ? C3 = `Object.getOwnPropertyDescriptor(globalThis, ${JSON.stringify(g4)}).set /*native setter*/` : C3 = `Object.getOwnPropertyDescriptor({/*unknown obj*/}, ${JSON.stringify(g4)}).set`;
        } else C3 = `(function(){/*name: ${i3(p3, E3)}, native function*/}})`;
        else C3 = `(function(){/*name: ${i3(p3, E3)}*/}})`;
        else C3 = `/*name: ${i3(p3, E3)}*/ (${d4()})`;
        else n ? N4() ? C3 = "(function(){/*native function*/}})" : C3 = "(function(){/*...*/}})" : C3 = `(${d4()})`;
      } else C3 = q2(e, E3);
      return s2 && console.groupEnd(), a5.set(e, C3), C3;
    } catch (a5) {
      s2 && console.groupEnd(), F2 && console.debug(`[toRepresentation] error is: ${a5}`, a5?.stack || a5);
      try {
        return String(e);
      } catch {
        return "{} /*error: catestrophic representation failure*/";
      }
    }
  }, m5, Eu = (e) => {
    if (m5 == null) {
      m5 = m5 || new Map($u.filter((E3) => {
        try {
          globalThis[E3];
        } catch {
          return false;
        }
        return true;
      }).map((E3) => [globalThis[E3], E3]));
      for (let [E3, s2] of Object.entries(B2 || {})) m5.set(E3, s2);
    }
    return m5.has(e);
  }, w3 = (e) => {
    c2.simplified == null && (c2.simplified = true);
    let E3 = "{", s2;
    try {
      s2 = Object.entries(Object.getOwnPropertyDescriptors(e));
    } catch (a5) {
      F2 && console.error(`[toRepresentation] error getting Object.propertyDescriptor
${a5?.stack || a5}`);
      try {
        return String(e);
      } catch {
        return "undefined /*error: catestrophic representation failure*/";
      }
    }
    for (let [a5, { value: n, writable: l, enumerable: f3, configurable: C3, get: r4, set: o2 }] of s2) {
      let y2 = bu(a5);
      r4 ? E3 += `
${t}get ${y2}(){/*contents*/}` : E3 += `
${t}${y2}: ${h({ string: i3(n, c2), by: c2.indent, noLead: true })},`;
    }
    return s2.length == 0 ? E3 += "}" : E3 += `
}`, E3;
  }, v4 = (e, E3) => {
    E3.simplified == null && (E3.simplified = true);
    let s2 = [], a5 = false;
    for (let n of e) {
      let l = i3(n, E3);
      s2.push(l), !a5 && l.includes(`
`) && (a5 = true);
    }
    return a5 ? `[
${s2.map((n) => h({ string: n, by: E3.indent, noLead: false })).join(`,
`)}
]` : `[${s2.join(",")}]`;
  }, G2 = (e, E3) => {
    let s2 = "";
    for (let [a5, n] of e) {
      E3.simplified == null && (E3.simplified = true);
      let l = i3(a5, E3), f3 = i3(n, E3);
      if (l.includes(`
`)) {
        let C3 = E3.indent + E3.indent;
        s2 += `
${E3.indent}[
${h({ string: l, by: C3, noLead: false })},
${h({ string: f3, by: C3, noLead: false })}
${E3.indent}],`;
      } else {
        let C3 = f3.includes(`
`) ? h({ string: f3, by: E3.indent, noLead: true }) : h({ string: f3, by: E3.indent, noLead: true });
        s2 += `
${E3.indent}[${l}, ${C3}],`;
      }
    }
    return s2.length == 0 ? "" : `[${s2}
]`;
  }, q2 = (e, E3) => {
    let s2 = Object.getPrototypeOf(e);
    if (s2 == null || s2 == xu) return w3(e);
    let n = s2.constructor?.name, l;
    (typeof n != "string" || n == "Object" || n == "Function") && (n = null);
    let f3 = () => n ? E3.simplified ? `new ${n}(/*...*/)` : `new ${n}(${w3(e)})` : w3(e);
    if (e instanceof Array || e instanceof T || e instanceof Set) {
      let C3;
      try {
        C3 = Object.keys(e).every((o2) => Number.isInteger(o2 - 0) && o2 >= 0);
      } catch (o2) {
        F2 && console.error(`[toRepresentation] error checking isAllIndexKeys
${o2?.stack || o2}`);
      }
      let r4;
      if (C3) try {
        r4 = v4(e, E3);
      } catch {
        C3 = false;
      }
      if (C3) if (n) l = `new ${n}(${r4})`;
      else if (e instanceof Array) l = r4;
      else if (e instanceof T) {
        for (let o2 of R) if (e instanceof o2) {
          l = `new ${o2.name}(${r4})`;
          break;
        }
      } else e instanceof Set && (l = `new Set(${r4})`);
      else l = f3(e);
    } else if (e instanceof Map) if (n && E3.simplified) l = `new ${n}(/*...*/)`;
    else {
      let C3 = [];
      try {
        C3 = Map.prototype.entries.call(e);
      } catch (o2) {
        F2 && console.error(`[toRepresentation] error getting Map.prototype.entries
${o2?.stack || o2}`);
      }
      let r4 = G2(C3, E3);
      n ? l = `new ${n}(${r4})` : l = `new Map(${r4})`;
    }
    else try {
      l = f3(e);
    } catch {
      try {
        l = w3(e);
      } catch {
        try {
          l = e.toString();
        } catch {
          return "undefined /*error: catestrophic representation failure*/";
        }
      }
    }
    return l;
  };
  try {
    return i3(u3, c2);
  } catch (e) {
    F2 && console.debug("[toRepresentation] error is:", e);
    try {
      return String(u3);
    } catch {
      return typeof u3;
    }
  }
};
var S = (u3) => typeof u3 == "symbol" ? j(u3) : u3 instanceof Object ? j(u3) : u3 != null ? u3.toString() : `${u3}`;
var Iu = (u3, D3) => {
  for (var F2 = [], A3, t = u3.global ? u3 : RegExp(u3, u3.flags + "g"); A3 = t.exec(D3); ) F2.push(A3), A3[0].length == 0 && (t.lastIndex += 1);
  return F2;
};
var Fu = { "&": "\\x26", "!": "\\x21", "#": "\\x23", $: "\\$", "%": "\\x25", "*": "\\*", "+": "\\+", ",": "\\x2c", ".": "\\.", ":": "\\x3a", ";": "\\x3b", "<": "\\x3c", "=": "\\x3d", ">": "\\x3e", "?": "\\?", "@": "\\x40", "^": "\\^", "`": "\\x60", "~": "\\x7e", "(": "\\(", ")": "\\)", "[": "\\[", "]": "\\]", "{": "\\{", "}": "\\}", "/": "\\/", "-": "\\x2d", "\\": "\\\\", "|": "\\|" };
var ku = new RegExp(`[${Object.values(Fu).join("")}]`, "gu");
function W(u3) {
  return u3.replaceAll(ku, (D3) => Fu[D3]);
}
var M = Symbol("regexpProxy");
var Au = RegExp.prototype.exec;
RegExp.prototype.exec = function(...u3) {
  return this[M] ? Au.apply(this[M], u3) : Au.apply(this, u3);
};
var J;
var zu = Object.freeze({ get(u3, D3) {
  return typeof D3 == "string" && D3.match(/^[igmusyv]+$/) ? J(u3, D3) : D3 == M ? u3 : u3[D3];
}, set(u3, D3, F2) {
  return u3[D3] = F2, true;
} });
J = (u3, D3) => {
  let F2 = new RegExp(u3, D3), A3 = new Proxy(F2, zu);
  return Object.setPrototypeOf(A3, Object.getPrototypeOf(F2)), A3;
};
function eu(u3) {
  return (D3, ...F2) => {
    let A3 = "";
    for (let [t, B2] of L(D3, F2)) A3 += t, B2 instanceof RegExp ? (!u3 && B2.flags.replace(/g/, "").length > 0 && console.warn(`Warning: flags inside of regex:
    The RegExp trigging this warning is: ${B2}
    When calling the regex interpolater (e.g. regex\`something\${stuff}\`)
    one of the \${} values (the one above) was a RegExp with a flag enabled
    e.g. /stuff/i  <- i = ignoreCase flag enabled
    When the /stuff/i gets interpolated, its going to loose its flags
    (thats what I'm warning you about)
    
    To disable/ignore this warning do:
        regex.stripFlags\`something\${/stuff/i}\`
    If you want to add flags to the output of regex\`something\${stuff}\` do:
        regex\`something\${stuff}\`.i   // ignoreCase
        regex\`something\${stuff}\`.ig  // ignoreCase and global
        regex\`something\${stuff}\`.gi  // functionally equivlent
`), A3 += `(?:${B2.source})`) : B2 != null && (A3 += W(S(B2)));
    return J(A3, "");
  };
}
var Cu = eu(false);
Cu.stripFlags = eu(true);
var tu = new TextDecoder("utf-8");
var Mu = tu.decode.bind(tu);
var ru = new TextEncoder("utf-8");
var Ju = ru.encode.bind(ru);

// https://esm.sh/gh/jeff-hykin/good-js@f6d5bcb/denonext/source/iterable.mjs
var m = function(t) {
  return t != null && typeof t[Symbol.asyncIterator] == "function";
};
var x = class {
};
try {
  x = eval("(async function(){}).constructor");
} catch (t) {
}
var F = function(t) {
  return t instanceof Object && typeof t[Symbol.iterator] == "function";
};
function _() {
  let t, o2 = "pending", n, r4 = new Promise((e, i3) => {
    t = { resolve(s2) {
      o2 === "pending" && Promise.resolve(s2).then((l) => {
        o2 = "fulfilled", e(l);
      }).catch((...l) => {
        o2 = "rejected", i3(...l);
      });
    }, reject(s2) {
      o2 === "pending" && (o2 = "rejected", i3(s2));
    }, [Symbol.iterator]() {
      throw Error("You're trying to sync-iterate over a promise");
    } };
  });
  return Object.defineProperty(r4, "state", { get: () => o2 }), Object.assign(r4, t);
}
var g = function* () {
}();
g.length = 0;
var C = class {
};
try {
  C = eval("(async function*(){}).constructor");
} catch (t) {
}
var M2 = class {
};
try {
  M2 = eval("(function*(){}).constructor");
} catch (t) {
}
var h2 = (t) => {
  if (t == null) return g;
  if (typeof t[Symbol.iterator] == "function" || typeof t[Symbol.asyncIterator] == "function") return t;
  if (typeof t?.next == "function") {
    let o2 = t?.next instanceof x, n;
    o2 ? n = { [Symbol.asyncIterator]() {
      return t;
    }, ...t } : n = { [Symbol.iterator]() {
      return t;
    }, [Symbol.asyncIterator]() {
      return t;
    }, ...t };
    for (let [r4, e] of Object.entries(t)) typeof e == "function" && (n[r4] = e.bind(t));
    return n;
  }
  return typeof t == "function" ? t() : Object.getPrototypeOf(t).constructor == Object ? Object.entries(t) : g;
};
var S2 = Symbol.for("iterationStop");
var p = (t) => {
  if (typeof t?.next == "function") return t;
  if (t == null) return g;
  if (typeof t[Symbol.iterator] == "function") {
    let o2 = t[Symbol.iterator]();
    return Number.isFinite(o2?.length) || (Number.isFinite(t?.length) ? o2.length = t.length : Number.isFinite(t?.size) && (o2.length = t.size)), o2;
  } else if (typeof t[Symbol.asyncIterator] == "function") {
    let o2 = t[Symbol.asyncIterator]();
    return Number.isFinite(o2?.length) || (Number.isFinite(t?.length) ? o2.length = t.length : Number.isFinite(t?.size) && (o2.length = t.size)), o2;
  } else {
    if (typeof t == "function") return t();
    if (Object.getPrototypeOf(t).constructor == Object) {
      let o2 = Object.entries(t), n = o2[Symbol.iterator]();
      return n.length = o2.length, n;
    }
  }
  return g;
};
var R2 = ({ value: t, done: o2 }) => o2 ? S2 : t;
var O = (t) => {
  if (t.next instanceof Function) {
    let o2 = t.next();
    return o2 instanceof Promise ? o2.then(R2) : R2(o2);
  } else throw Error("can't call next(object) on the following object as there is no object.next() method", t);
};
function T2(t, o2) {
  t = h2(t);
  let n;
  return m(t) ? n = async function* () {
    let r4 = -1;
    for await (let e of t) yield await o2(e, ++r4);
  }() : n = function* () {
    let r4 = -1;
    for (let e of t) yield o2(e, ++r4);
  }(), typeof t.size == "number" && (n.length = t.size), typeof t.length == "number" && (n.length = t.length), n;
}
function q(t, o2) {
  t = h2(t);
  let n;
  return m(t) || o2 instanceof x ? n = async function* () {
    let r4 = -1;
    for await (let e of t) await o2(e, ++r4) && (yield e);
  }() : n = function* () {
    let r4 = -1;
    for (let e of t) o2(e, ++r4) && (yield e);
  }(), n;
}
function B(...t) {
  t = t.map(h2);
  let o2;
  if (t.some(m) ? o2 = async function* () {
    for (let n of t) for await (let r4 of n) yield r4;
  }() : o2 = function* () {
    for (let n of t) yield* n;
  }(), t.every((n) => typeof n.length == "number" && n.length === n.length)) {
    let n = 0;
    for (let r4 of t) n += r4.length;
    o2.length = n;
  }
  return o2;
}
function Z(t, o2) {
  t = h2(t);
  let n;
  if (m(t) || o2 instanceof x) return async function() {
    let r4 = -1, e;
    for await (let i3 of t) r4++, r4 == -1 ? e = await o2(i3, r4) : e = await o2(i3, r4, e);
    return e;
  }();
  {
    let r4 = -1, e;
    for (let i3 of t) r4++, r4 == -1 ? e = o2(i3, r4) : e = o2(i3, r4, e);
    return e;
  }
}
function j2({ iterable: t, depth: o2 = 1 / 0, asyncsInsideSyncIterable: n = false }) {
  return o2 <= 0 ? t : (t = h2(t), m(t) || n ? async function* () {
    for await (let r4 of t) if (m(r4) || F(r4)) for await (let e of j2({ iterable: r4, depth: o2 - 1, asyncsInsideSyncIterable: n })) yield e;
    else yield r4;
  }() : function* () {
    for (let r4 of t) if (F(r4)) for (let e of j2({ iterable: r4, depth: o2 - 1 })) yield e;
    else yield r4;
  }());
}
function w(t) {
  let o2 = _(), n;
  try {
    n = p(t), Number.isFinite(n?.length) && (o2.length = n.length);
  } catch (i3) {
    return o2.reject(i3), o2;
  }
  o2[Symbol.asyncIterator] = () => n;
  let r4 = [], e = () => {
    let i3;
    try {
      i3 = n.next();
    } catch (s2) {
      o2.reject(s2);
      return;
    }
    if (i3 == null) {
      o2.reject(Error("When iterating over an async iterator, the .next() returned null/undefined"));
      return;
    }
    if (typeof i3.then != "function") {
      let { value: s2, done: l } = i3;
      l ? o2.resolve(r4) : (r4.push(s2), e());
      return;
    }
    i3.catch(o2.reject), i3.then(({ value: s2, done: l }) => {
      l ? o2.resolve(r4) : (r4.push(s2), e());
    });
  };
  o2.results = r4;
  try {
    e();
  } catch (i3) {
    o2.reject(i3);
  }
  return o2;
}
function V(t) {
  let o2 = t instanceof Array || typeof t == "string", n = t instanceof Set;
  if (o2 || n) {
    let r4 = o2 ? t.length : t.size, e = r4, i3 = function* () {
      for (; e > 0; ) yield t[--e];
    }();
    return i3.length = r4, i3;
  }
  return m(t) ? w(t).then((r4) => reversed(r4)) : [...t].reverse();
}
function A(t, o2 = { _prevPromise: null }) {
  let { _prevPromise: n } = o2;
  t = h2(t);
  let r4 = { then: null, catch: null, finally: null }, e = _();
  return delete e[Symbol.iterator], m(t) ? e[Symbol.asyncIterator] = () => {
    let i3 = p(t), s2 = -1, l = false, f3 = false, a5 = async (c2, u3, y2) => {
      if (!f3) {
        f3 = true, r4.finally && await r4.finally();
        let d4 = false;
        try {
          await n;
        } catch (I2) {
          d4 = true, e.reject(I2);
        }
        d4 || (u3 ? e.reject(u3) : e.resolve(c2));
      }
    };
    return { async next() {
      let c2 = { value: null, done: true };
      s2++;
      try {
        c2 = await i3.next();
      } catch (u3) {
        if (l = u3, !r4.catch) c2.reject(u3);
        else try {
          await r4.catch(u3, s2), l = void 0, c2.done = true;
        } catch (y2) {
          c2.reject(y2);
        }
      } finally {
        if (c2.done) {
          if (!l) {
            let u3;
            try {
              u3 = await (r4.then && r4.then(s2));
            } catch (y2) {
              throw l = y2, y2;
            } finally {
              a5(u3, l, s2);
            }
          }
          a5(void 0, l, s2);
        }
      }
      return c2;
    } };
  } : e[Symbol.iterator] = () => {
    let i3 = p(t), s2 = -1, l = false, f3 = false, a5 = async (c2, u3, y2) => {
      if (!f3) {
        f3 = true, r4.finally && await r4.finally();
        let d4 = false;
        try {
          await n;
        } catch (I2) {
          d4 = true, e.reject(I2);
        }
        d4 || (u3 ? e.reject(c2) : e.resolve(c2));
      }
    };
    return { next() {
      let c2 = { value: null, done: true };
      s2++;
      try {
        c2 = i3.next();
      } catch (u3) {
        l = true;
        let y2 = false;
        try {
          return r4.catch && r4.catch(u3, s2), { done: true };
        } catch (d4) {
          y2 = true, c2.reject(d4);
        }
        throw y2 || c2.reject(u3), u3;
      } finally {
        if (c2.done) {
          if (!l) {
            let u3;
            try {
              u3 = r4.then && r4.then(s2);
            } finally {
              a5(u3, l, s2);
            }
          }
          a5(void 0, l, s2);
        }
      }
      return c2;
    } };
  }, Object.assign(e, { then(i3) {
    return r4.then = i3, A(e, { _prevPromise: e });
  }, catch(i3) {
    return r4.catch = i3, A(e, { _prevPromise: e });
  }, finally(i3) {
    return r4.finally = i3, A(e, { _prevPromise: e });
  } }), typeof t.length == "number" && t.length === t.length && (e.length = t.length), e;
}
function z2({ data: t, filters: o2, outputArrays: n = false }) {
  let r4 = m(t), e = {}, i3 = p(t);
  for (let [s2, l] of Object.entries(o2)) {
    let f3 = [], a5 = 0;
    r4 || l instanceof x ? e[s2] = new b2(async function* () {
      for (; ; ) {
        if (e[s2].hitError) throw e[s2].hitError;
        if (f3.length == 0) {
          let c2 = await O(i3);
          if (c2 == S2) break;
          for (let [u3, y2] of Object.entries(e)) {
            let d4 = false;
            try {
              d4 = await y2.check(c2, a5++);
            } catch (I2) {
              y2.hitError = I2;
            }
            d4 && y2.que.push(c2);
          }
        }
        f3.length != 0 && (yield f3.shift());
      }
    }()) : e[s2] = new b2(function* () {
      for (; ; ) {
        if (e[s2].hitError) throw e[s2].hitError;
        if (f3.length == 0) {
          let c2 = O(i3);
          if (c2 == S2) break;
          for (let [u3, y2] of Object.entries(e)) {
            let d4 = false;
            try {
              d4 = y2.check(c2, a5++);
            } catch (I2) {
              y2.hitError = I2;
            }
            d4 && y2.que.push(c2);
          }
        }
        f3.length != 0 && (yield f3.shift());
      }
    }()), e[s2].check = l, e[s2].hitError = false, e[s2].que = f3;
  }
  if (n) for (let [s2, l] of Object.entries(e)) m(l) ? e[s2] = w(l) : e[s2] = [...l];
  return e;
}
function b2(t, o2 = { length: null, _createEmpty: false }) {
  let { length: n, _createEmpty: r4 } = { length: null, _createEmpty: false, ...o2 };
  if (r4) return this;
  let e = this === void 0 || this === globalThis ? new b2(null, { _createEmpty: true }) : this;
  return t instanceof Array ? e.length = t.length : t instanceof Set ? e.length = t.size : typeof n == "number" && (e.length = n), e._source = h2(t), e._source[Symbol.iterator] && (e[Symbol.iterator] = e._source[Symbol.iterator].bind(e._source)), e._source[Symbol.asyncIterator] && (e[Symbol.asyncIterator] = e._source[Symbol.asyncIterator].bind(e._source)), e[Symbol.isConcatSpreadable] = true, e.lengthIs = function(i3) {
    return e.length = i3, e;
  }, e.map = function(i3) {
    let s2 = { ...e._source, [Symbol.iterator]: () => {
      let f3 = p(e._source), a5 = 0;
      return { next() {
        let { value: c2, done: u3 } = f3.next();
        return { value: u3 || i3(c2, a5++), done: u3 };
      } };
    } };
    return (m(e._source) || i3 instanceof x) && (s2[Symbol.asyncIterator] = () => {
      let f3 = p(e._source), a5 = 0;
      return { async next() {
        let { value: c2, done: u3 } = await f3.next();
        return { value: u3 || await i3(c2, a5++), done: u3 };
      } };
    }), new b2(s2);
  }, e.filter = function(i3) {
    let s2 = { ...e._source, [Symbol.iterator]: () => {
      let f3 = p(e._source), a5 = 0;
      return { next() {
        for (; ; ) {
          let c2 = f3.next();
          if (c2.done || i3(c2.value, a5++)) return c2;
        }
      } };
    } };
    return (m(e._source) || i3 instanceof x) && (s2[Symbol.asyncIterator] = () => {
      let f3 = p(e._source), a5 = 0;
      return { async next() {
        for (; ; ) {
          let c2 = await f3.next();
          if (c2.done || await i3(c2.value, a5++)) return c2;
        }
      } };
    }), new b2(s2);
  }, e.forkBy = ({ ...i3 }, ...s2) => z2({ ...i3, data: e }, ...s2), e.flat = (i3 = 1, s2 = false) => new b2(j2({ iterable: e, depth: i3, asyncsInsideSyncIterable: s2 })), e.then = (i3) => {
    let s2 = { ...e._source, [Symbol.iterator]: () => {
      let f3 = p(e._source), a5 = -1;
      return { next() {
        let c2 = f3.next();
        return a5++, c2.done && i3(e, a5), c2;
      } };
    } };
    return m(e._source) && (s2[Symbol.asyncIterator] = () => {
      let f3 = p(e._source), a5 = -1;
      return { async next() {
        let c2 = await f3.next();
        return a5++, c2.done && await i3(e, a5), c2;
      } };
    }), new b2(s2);
  }, e.finally = (i3) => {
    let s2 = { ...e._source, [Symbol.iterator]: () => {
      let f3 = p(e._source), a5 = -1;
      return { next() {
        let c2 = { value: null, done: true };
        try {
          c2 = f3.next(), a5++;
        } finally {
          c2.done && i3(e, a5);
        }
      } };
    } };
    return m(e._source) && (s2[Symbol.asyncIterator] = () => {
      let f3 = p(e._source), a5 = 0;
      return { async next() {
        let c2 = { value: null, done: true };
        try {
          c2 = await f3.next(), a5++;
        } finally {
          c2.done && await i3(e, a5);
        }
      } };
    }), new b2(s2);
  }, Object.defineProperties(e, { toArray: { get() {
    return e[Symbol.asyncIterator] ? (async () => {
      let i3 = e[Symbol.asyncIterator](), s2 = [];
      for (; ; ) {
        let { value: l, done: f3 } = await i3.next();
        if (f3) break;
        s2.push(l);
      }
      return s2;
    })() : [...e];
  } }, flattened: { get() {
    return e.flat(1 / 0);
  } } }), e;
}
var W2 = function* (...t) {
  let o2 = t.map(p);
  for (; ; ) {
    let n = o2.map((r4) => r4.next());
    if (n.every((r4) => r4.done)) break;
    yield n.map((r4) => r4.value);
  }
};
var P2 = function(...t) {
  let o2 = W2(...t), n = Math.max(...t.map((r4) => typeof r4 != "function" && (typeof r4?.length == "number" ? r4?.length : r4.size)));
  return n == n && (o2.length = n), o2;
};
var E = function* ({ start: t = 0, end: o2 = 1 / 0, step: n = 1 }) {
  let r4 = t;
  for (; r4 <= o2; ) yield r4, r4 += n;
};
var H2 = function* (...t) {
  let o2 = 0;
  for (let n of P2(...t)) yield [o2++, ...n];
};
var D = function* (t) {
  yield t.slice();
  let o2 = t.length, n = new Array(o2).fill(0), r4 = 1, e, i3;
  for (; r4 < o2; ) n[r4] < r4 ? (e = r4 % 2 && n[r4], i3 = t[r4], t[r4] = t[e], t[e] = i3, ++n[r4], r4 = 1, yield t.slice()) : (n[r4] = 0, ++r4);
};
var k2 = function* (t, o2, n) {
  if (o2 === n && n === void 0 ? (n = 1, o2 = t.length) : (o2 = o2 || t.length, n = n === void 0 ? o2 : n), n !== o2) for (let r4 = n; r4 <= o2; r4++) yield* k2(t, r4, r4);
  else if (o2 === 1) yield* t.map((r4) => [r4]);
  else for (let r4 = 0; r4 < t.length; r4++) for (let e of k2(t.slice(r4 + 1, t.length), o2 - 1, o2 - 1)) yield [t[r4], ...e];
};
var Y2 = function* (t) {
  let o2 = E({ start: 1, end: numberOfPartitions.length - 1 });
  for (let n of k2(o2)) {
    n.sort();
    let r4 = 0, e = [];
    for (let i3 of [...n, t.length]) e.push(t.slice(r4, i3)), r4 = i3;
    yield e;
  }
};
function v(t, { valueToKey: o2 = null, sort: n = false } = {}) {
  if (t = h2(t), o2 = o2 || ((r4) => r4), m(t)) return async function() {
    let r4 = /* @__PURE__ */ new Map();
    for await (let e of t) e = o2(e), r4.set(e, (r4.get(e) || 0) + 1);
    return n ? n > 0 ? new Map([...r4.entries()].sort((e, i3) => i3[1] - e[1])) : new Map([...r4.entries()].sort((e, i3) => e[1] - i3[1])) : r4;
  }();
  {
    let r4 = /* @__PURE__ */ new Map();
    for (let e of t) e = o2(e), r4.set(e, (r4.get(e) || 0) + 1);
    return n ? n > 0 ? new Map([...r4.entries()].sort((e, i3) => i3[1] - e[1])) : new Map([...r4.entries()].sort((e, i3) => e[1] - i3[1])) : r4;
  }
}
var N = "Threw while mapping";
function G({ iterator: t, transformFunction: o2, poolLimit: n = null, awaitAll: r4 = false }) {
  n = n || G.defaultPoolLimit;
  let e = new TransformStream({ async transform(l, f3) {
    try {
      let a5 = await l;
      f3.enqueue(a5);
    } catch (a5) {
      a5 instanceof AggregateError && a5.message == N && f3.error(a5);
    }
  } }), i3 = (async () => {
    let l = e.writable.getWriter(), f3 = [];
    try {
      let a5 = 0;
      for await (let c2 of t) {
        let u3 = Promise.resolve().then(() => o2(c2, a5));
        a5++, l.write(u3);
        let y2 = u3.then(() => f3.splice(f3.indexOf(y2), 1));
        f3.push(y2), f3.length >= n && await Promise.race(f3);
      }
      await Promise.all(f3), l.close();
    } catch {
      let a5 = [];
      for (let c2 of await Promise.allSettled(f3)) c2.status == "rejected" && a5.push(c2.reason);
      l.write(Promise.reject(new AggregateError(a5, N))).catch(() => {
      });
    }
  })(), s2 = e.readable[Symbol.asyncIterator]();
  return r4 ? i3.then(() => w(s2)) : s2;
}
G.defaultPoolLimit = 40;

// https://deno.land/std@0.191.0/_util/asserts.ts
var DenoStdInternalError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError(msg);
  }
}

// https://deno.land/std@0.191.0/bytes/copy.ts
function copy(src, dst, off = 0) {
  off = Math.max(0, Math.min(off, dst.byteLength));
  const dstBytesAvailable = dst.byteLength - off;
  if (src.byteLength > dstBytesAvailable) {
    src = src.subarray(0, dstBytesAvailable);
  }
  dst.set(src, off);
  return src.byteLength;
}

// https://deno.land/std@0.191.0/io/buf_reader.ts
var DEFAULT_BUF_SIZE = 4096;
var MIN_BUF_SIZE = 16;
var MAX_CONSECUTIVE_EMPTY_READS = 100;
var CR = "\r".charCodeAt(0);
var LF = "\n".charCodeAt(0);
var BufferFullError = class extends Error {
  constructor(partial) {
    super("Buffer full");
    this.partial = partial;
  }
  name = "BufferFullError";
};
var PartialReadError = class extends Error {
  name = "PartialReadError";
  partial;
  constructor() {
    super("Encountered UnexpectedEof, data only partially read");
  }
};
var BufReader = class _BufReader {
  #buf;
  #rd;
  // Reader provided by caller.
  #r = 0;
  // buf read position.
  #w = 0;
  // buf write position.
  #eof = false;
  // private lastByte: number;
  // private lastCharSize: number;
  /** return new BufReader unless r is BufReader */
  static create(r4, size = DEFAULT_BUF_SIZE) {
    return r4 instanceof _BufReader ? r4 : new _BufReader(r4, size);
  }
  constructor(rd, size = DEFAULT_BUF_SIZE) {
    if (size < MIN_BUF_SIZE) {
      size = MIN_BUF_SIZE;
    }
    this.#reset(new Uint8Array(size), rd);
  }
  /** Returns the size of the underlying buffer in bytes. */
  size() {
    return this.#buf.byteLength;
  }
  buffered() {
    return this.#w - this.#r;
  }
  // Reads a new chunk into the buffer.
  #fill = async () => {
    if (this.#r > 0) {
      this.#buf.copyWithin(0, this.#r, this.#w);
      this.#w -= this.#r;
      this.#r = 0;
    }
    if (this.#w >= this.#buf.byteLength) {
      throw Error("bufio: tried to fill full buffer");
    }
    for (let i3 = MAX_CONSECUTIVE_EMPTY_READS; i3 > 0; i3--) {
      const rr = await this.#rd.read(this.#buf.subarray(this.#w));
      if (rr === null) {
        this.#eof = true;
        return;
      }
      assert(rr >= 0, "negative read");
      this.#w += rr;
      if (rr > 0) {
        return;
      }
    }
    throw new Error(
      `No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`
    );
  };
  /** Discards any buffered data, resets all state, and switches
   * the buffered reader to read from r.
   */
  reset(r4) {
    this.#reset(this.#buf, r4);
  }
  #reset = (buf, rd) => {
    this.#buf = buf;
    this.#rd = rd;
    this.#eof = false;
  };
  /** reads data into p.
   * It returns the number of bytes read into p.
   * The bytes are taken from at most one Read on the underlying Reader,
   * hence n may be less than len(p).
   * To read exactly len(p) bytes, use io.ReadFull(b, p).
   */
  async read(p3) {
    let rr = p3.byteLength;
    if (p3.byteLength === 0) return rr;
    if (this.#r === this.#w) {
      if (p3.byteLength >= this.#buf.byteLength) {
        const rr2 = await this.#rd.read(p3);
        const nread = rr2 ?? 0;
        assert(nread >= 0, "negative read");
        return rr2;
      }
      this.#r = 0;
      this.#w = 0;
      rr = await this.#rd.read(this.#buf);
      if (rr === 0 || rr === null) return rr;
      assert(rr >= 0, "negative read");
      this.#w += rr;
    }
    const copied = copy(this.#buf.subarray(this.#r, this.#w), p3, 0);
    this.#r += copied;
    return copied;
  }
  /** reads exactly `p.length` bytes into `p`.
   *
   * If successful, `p` is returned.
   *
   * If the end of the underlying stream has been reached, and there are no more
   * bytes available in the buffer, `readFull()` returns `null` instead.
   *
   * An error is thrown if some bytes could be read, but not enough to fill `p`
   * entirely before the underlying stream reported an error or EOF. Any error
   * thrown will have a `partial` property that indicates the slice of the
   * buffer that has been successfully filled with data.
   *
   * Ported from https://golang.org/pkg/io/#ReadFull
   */
  async readFull(p3) {
    let bytesRead = 0;
    while (bytesRead < p3.length) {
      try {
        const rr = await this.read(p3.subarray(bytesRead));
        if (rr === null) {
          if (bytesRead === 0) {
            return null;
          } else {
            throw new PartialReadError();
          }
        }
        bytesRead += rr;
      } catch (err) {
        if (err instanceof PartialReadError) {
          err.partial = p3.subarray(0, bytesRead);
        }
        throw err;
      }
    }
    return p3;
  }
  /** Returns the next byte [0, 255] or `null`. */
  async readByte() {
    while (this.#r === this.#w) {
      if (this.#eof) return null;
      await this.#fill();
    }
    const c2 = this.#buf[this.#r];
    this.#r++;
    return c2;
  }
  /** readString() reads until the first occurrence of delim in the input,
   * returning a string containing the data up to and including the delimiter.
   * If ReadString encounters an error before finding a delimiter,
   * it returns the data read before the error and the error itself
   * (often `null`).
   * ReadString returns err != nil if and only if the returned data does not end
   * in delim.
   * For simple uses, a Scanner may be more convenient.
   */
  async readString(delim) {
    if (delim.length !== 1) {
      throw new Error("Delimiter should be a single character");
    }
    const buffer = await this.readSlice(delim.charCodeAt(0));
    if (buffer === null) return null;
    return new TextDecoder().decode(buffer);
  }
  /** `readLine()` is a low-level line-reading primitive. Most callers should
   * use `readString('\n')` instead or use a Scanner.
   *
   * `readLine()` tries to return a single line, not including the end-of-line
   * bytes. If the line was too long for the buffer then `more` is set and the
   * beginning of the line is returned. The rest of the line will be returned
   * from future calls. `more` will be false when returning the last fragment
   * of the line. The returned buffer is only valid until the next call to
   * `readLine()`.
   *
   * The text returned from ReadLine does not include the line end ("\r\n" or
   * "\n").
   *
   * When the end of the underlying stream is reached, the final bytes in the
   * stream are returned. No indication or error is given if the input ends
   * without a final line end. When there are no more trailing bytes to read,
   * `readLine()` returns `null`.
   *
   * Calling `unreadByte()` after `readLine()` will always unread the last byte
   * read (possibly a character belonging to the line end) even if that byte is
   * not part of the line returned by `readLine()`.
   */
  async readLine() {
    let line = null;
    try {
      line = await this.readSlice(LF);
    } catch (err) {
      let partial;
      if (err instanceof PartialReadError) {
        partial = err.partial;
        assert(
          partial instanceof Uint8Array,
          "bufio: caught error from `readSlice()` without `partial` property"
        );
      }
      if (!(err instanceof BufferFullError)) {
        throw err;
      }
      partial = err.partial;
      if (!this.#eof && partial && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR) {
        assert(this.#r > 0, "bufio: tried to rewind past start of buffer");
        this.#r--;
        partial = partial.subarray(0, partial.byteLength - 1);
      }
      if (partial) {
        return { line: partial, more: !this.#eof };
      }
    }
    if (line === null) {
      return null;
    }
    if (line.byteLength === 0) {
      return { line, more: false };
    }
    if (line[line.byteLength - 1] == LF) {
      let drop = 1;
      if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
        drop = 2;
      }
      line = line.subarray(0, line.byteLength - drop);
    }
    return { line, more: false };
  }
  /** `readSlice()` reads until the first occurrence of `delim` in the input,
   * returning a slice pointing at the bytes in the buffer. The bytes stop
   * being valid at the next read.
   *
   * If `readSlice()` encounters an error before finding a delimiter, or the
   * buffer fills without finding a delimiter, it throws an error with a
   * `partial` property that contains the entire buffer.
   *
   * If `readSlice()` encounters the end of the underlying stream and there are
   * any bytes left in the buffer, the rest of the buffer is returned. In other
   * words, EOF is always treated as a delimiter. Once the buffer is empty,
   * it returns `null`.
   *
   * Because the data returned from `readSlice()` will be overwritten by the
   * next I/O operation, most clients should use `readString()` instead.
   */
  async readSlice(delim) {
    let s2 = 0;
    let slice;
    while (true) {
      let i3 = this.#buf.subarray(this.#r + s2, this.#w).indexOf(delim);
      if (i3 >= 0) {
        i3 += s2;
        slice = this.#buf.subarray(this.#r, this.#r + i3 + 1);
        this.#r += i3 + 1;
        break;
      }
      if (this.#eof) {
        if (this.#r === this.#w) {
          return null;
        }
        slice = this.#buf.subarray(this.#r, this.#w);
        this.#r = this.#w;
        break;
      }
      if (this.buffered() >= this.#buf.byteLength) {
        this.#r = this.#w;
        const oldbuf = this.#buf;
        const newbuf = this.#buf.slice(0);
        this.#buf = newbuf;
        throw new BufferFullError(oldbuf);
      }
      s2 = this.#w - this.#r;
      try {
        await this.#fill();
      } catch (err) {
        if (err instanceof PartialReadError) {
          err.partial = slice;
        }
        throw err;
      }
    }
    return slice;
  }
  /** `peek()` returns the next `n` bytes without advancing the reader. The
   * bytes stop being valid at the next read call.
   *
   * When the end of the underlying stream is reached, but there are unread
   * bytes left in the buffer, those bytes are returned. If there are no bytes
   * left in the buffer, it returns `null`.
   *
   * If an error is encountered before `n` bytes are available, `peek()` throws
   * an error with the `partial` property set to a slice of the buffer that
   * contains the bytes that were available before the error occurred.
   */
  async peek(n) {
    if (n < 0) {
      throw Error("negative count");
    }
    let avail = this.#w - this.#r;
    while (avail < n && avail < this.#buf.byteLength && !this.#eof) {
      try {
        await this.#fill();
      } catch (err) {
        if (err instanceof PartialReadError) {
          err.partial = this.#buf.subarray(this.#r, this.#w);
        }
        throw err;
      }
      avail = this.#w - this.#r;
    }
    if (avail === 0 && this.#eof) {
      return null;
    } else if (avail < n && this.#eof) {
      return this.#buf.subarray(this.#r, this.#r + avail);
    } else if (avail < n) {
      throw new BufferFullError(this.#buf.subarray(this.#r, this.#w));
    }
    return this.#buf.subarray(this.#r, this.#r + n);
  }
};

// https://deno.land/std@0.191.0/bytes/concat.ts
function concat(...buf) {
  let length = 0;
  for (const b5 of buf) {
    length += b5.length;
  }
  const output2 = new Uint8Array(length);
  let index = 0;
  for (const b5 of buf) {
    output2.set(b5, index);
    index += b5.length;
  }
  return output2;
}

// https://deno.land/std@0.191.0/io/read_lines.ts
async function* readLines(reader, decoderOpts) {
  const bufReader = new BufReader(reader);
  let chunks = [];
  const decoder = new TextDecoder(decoderOpts?.encoding, decoderOpts);
  while (true) {
    const res = await bufReader.readLine();
    if (!res) {
      if (chunks.length > 0) {
        yield decoder.decode(concat(...chunks));
      }
      break;
    }
    chunks.push(res.line);
    if (!res.more) {
      yield decoder.decode(concat(...chunks));
      chunks = [];
    }
  }
}

// https://deno.land/x/quickr@0.8.4/main/console.js
var symbolForConsoleLog = Symbol.for("console.log");
var realConsole = globalThis[symbolForConsoleLog] = globalThis[symbolForConsoleLog] || globalThis.console;
var isBrowserContext = typeof document != "undefined" && typeof window != "undefined";
var env = null;
var originalThing = realConsole;
var proxySymbol = Symbol.for("Proxy");
var thisProxySymbol = Symbol("thisProxy");
var originalLog = realConsole.log.bind(realConsole);
var patchedLog = (...args2) => {
  args2 = args2.map((each2) => {
    if (each2 instanceof Object && each2[symbolForConsoleLog] instanceof Function) {
      return each2[symbolForConsoleLog]();
    }
    return each2;
  });
  return originalLog(...args2);
};
patchedLog.isPatched = true;
globalThis.console = new Proxy(originalThing, {
  defineProperty: Reflect.defineProperty,
  getPrototypeOf: Reflect.getPrototypeOf,
  // Object.keys
  ownKeys(...args2) {
    return Reflect.ownKeys(...args2);
  },
  // function call (original value needs to be a function)
  apply(original, context, ...args2) {
    console.log(args2);
  },
  // new operator (original value needs to be a class)
  construct(...args2) {
  },
  get(original, key, ...args2) {
    if (key == proxySymbol || key == thisProxySymbol) {
      return true;
    }
    if (key == "log") {
      return patchedLog;
    }
    return Reflect.get(original, key, ...args2);
  },
  set(original, key, ...args2) {
    if (key == proxySymbol || key == thisProxySymbol) {
      return;
    }
    return Reflect.set(original, key, ...args2);
  }
});
var codeToEscapeString = (code) => `\x1B[${code}m`;
var ansiRegexPattern = /[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g;
function clearAnsiStylesFrom(string) {
  return `${string}`.replace(ansiRegexPattern, "");
}
var styleStrings = {
  reset: codeToEscapeString(0),
  bold: codeToEscapeString(1),
  dim: codeToEscapeString(2),
  italic: codeToEscapeString(3),
  underline: codeToEscapeString(4),
  slowBlink: codeToEscapeString(5),
  // not widely supported
  fastBlink: codeToEscapeString(6),
  // not widely supported
  inverse: codeToEscapeString(7),
  strikethrough: codeToEscapeString(9),
  primary: codeToEscapeString(11),
  // forground colors
  black: codeToEscapeString(30),
  red: codeToEscapeString(31),
  green: codeToEscapeString(32),
  yellow: codeToEscapeString(33),
  blue: codeToEscapeString(34),
  magenta: codeToEscapeString(35),
  cyan: codeToEscapeString(36),
  white: codeToEscapeString(37),
  lightBlack: codeToEscapeString(90),
  lightRed: codeToEscapeString(91),
  lightGreen: codeToEscapeString(92),
  lightYellow: codeToEscapeString(93),
  lightBlue: codeToEscapeString(94),
  lightMagenta: codeToEscapeString(95),
  lightCyan: codeToEscapeString(96),
  lightWhite: codeToEscapeString(97),
  // background
  blackBackground: codeToEscapeString(40),
  redBackground: codeToEscapeString(41),
  greenBackground: codeToEscapeString(42),
  yellowBackground: codeToEscapeString(43),
  blueBackground: codeToEscapeString(44),
  magentaBackground: codeToEscapeString(45),
  cyanBackground: codeToEscapeString(46),
  whiteBackground: codeToEscapeString(47),
  lightBlackBackground: codeToEscapeString(100),
  lightRedBackground: codeToEscapeString(101),
  lightGreenBackground: codeToEscapeString(102),
  lightYellowBackground: codeToEscapeString(103),
  lightBlueBackground: codeToEscapeString(104),
  lightMagentaBackground: codeToEscapeString(105),
  lightCyanBackground: codeToEscapeString(106),
  lightWhiteBackground: codeToEscapeString(107)
};
Object.assign(styleStrings, {
  gray: styleStrings.lightBlack,
  grey: styleStrings.lightBlack,
  lightGray: styleStrings.white,
  // lightWhite is "true" white
  lightGrey: styleStrings.white,
  // lightWhite is "true" white
  grayBackground: styleStrings.lightBlackBackground,
  greyBackground: styleStrings.lightBlackBackground,
  lightGrayBackground: styleStrings.whiteBackground,
  lightGreyBackground: styleStrings.whiteBackground
});
var styleObjectSymbol = Symbol("consoleStyle");
var styleObject = (rootStyleString) => {
  const createStyleAccumulator = (styleString) => {
    const styleAccumulator = (strings, ...values) => {
      const objectToStyledString = (interpolatedValue, styles) => {
        let singleCombinedString2 = "";
        if (interpolatedValue instanceof Object && interpolatedValue[styleObjectSymbol] instanceof Function) {
          singleCombinedString2 += interpolatedValue[styleObjectSymbol]();
        } else {
          singleCombinedString2 += S(interpolatedValue);
        }
        singleCombinedString2 += styleStrings.reset + styleAccumulator.styles.join("");
        return singleCombinedString2;
      };
      let singleCombinedString = "";
      if (!(strings instanceof Array) || strings.length < 1 || !strings.every((each2) => typeof each2 == "string")) {
        for (const each2 of [strings, ...values]) {
          singleCombinedString += objectToStyledString(each2);
        }
      } else {
        for (const index in values) {
          singleCombinedString += strings[index];
          singleCombinedString += objectToStyledString(values[index]);
        }
        const lastString = strings.slice(-1)[0];
        singleCombinedString += lastString;
      }
      styleAccumulator.sequence.push(singleCombinedString);
      styleAccumulator.toJSON = styleAccumulator.toString;
      return styleAccumulator;
    };
    styleAccumulator[styleObjectSymbol] = true;
    styleAccumulator.styles = [styleString];
    styleAccumulator.sequence = [styleString];
    styleAccumulator.toString = () => styleAccumulator.sequence.join("") + styleStrings.reset;
    styleAccumulator[Deno.customInspect] = () => styleAccumulator.sequence.join("") + styleStrings.reset;
    styleAccumulator[symbolForConsoleLog] = () => {
      const asString = styleAccumulator.toString();
      if (Console.reliableColorSupport.includesAnsi) {
        return asString;
      } else {
        return clearAnsiStylesFrom(asString);
      }
    };
    return Object.defineProperties(styleAccumulator, Object.fromEntries(Object.entries(styleStrings).map(
      ([key, value]) => [
        key,
        {
          get() {
            styleAccumulator.styles.push(value);
            styleAccumulator.sequence.push(value);
            return styleAccumulator;
          }
        }
      ]
    )));
  };
  const topLevelStyleAccumulator = (strings, ...values) => createStyleAccumulator(rootStyleString)(strings, ...values);
  topLevelStyleAccumulator[styleObjectSymbol] = true;
  topLevelStyleAccumulator.toString = () => rootStyleString;
  topLevelStyleAccumulator[symbolForConsoleLog] = () => {
    const asString = topLevelStyleAccumulator.toString();
    if (Console.reliableColorSupport.includesAnsi) {
      return asString;
    } else {
      return clearAnsiStylesFrom(asString);
    }
  };
  return Object.defineProperties(topLevelStyleAccumulator, Object.fromEntries(Object.entries(styleStrings).map(
    ([eachStyleName, eachStyleString]) => [
      eachStyleName,
      {
        get() {
          const styleAccumulator = createStyleAccumulator(rootStyleString);
          styleAccumulator.styles.push(eachStyleString);
          styleAccumulator.sequence.push(eachStyleString);
          return styleAccumulator;
        }
      }
    ]
  )));
};
var bold = styleObject(styleStrings.bold);
var reset = styleObject(styleStrings.reset);
var dim = styleObject(styleStrings.dim);
var italic = styleObject(styleStrings.italic);
var underline = styleObject(styleStrings.underline);
var inverse = styleObject(styleStrings.inverse);
var strikethrough = styleObject(styleStrings.strikethrough);
var black = styleObject(styleStrings.black);
var white = styleObject(styleStrings.white);
var red = styleObject(styleStrings.red);
var green = styleObject(styleStrings.green);
var blue = styleObject(styleStrings.blue);
var yellow = styleObject(styleStrings.yellow);
var cyan = styleObject(styleStrings.cyan);
var magenta = styleObject(styleStrings.magenta);
var lightBlack = styleObject(styleStrings.lightBlack);
var lightWhite = styleObject(styleStrings.lightWhite);
var lightRed = styleObject(styleStrings.lightRed);
var lightGreen = styleObject(styleStrings.lightGreen);
var lightBlue = styleObject(styleStrings.lightBlue);
var lightYellow = styleObject(styleStrings.lightYellow);
var lightMagenta = styleObject(styleStrings.lightMagenta);
var lightCyan = styleObject(styleStrings.lightCyan);
var blackBackground = styleObject(styleStrings.blackBackground);
var whiteBackground = styleObject(styleStrings.whiteBackground);
var redBackground = styleObject(styleStrings.redBackground);
var greenBackground = styleObject(styleStrings.greenBackground);
var blueBackground = styleObject(styleStrings.blueBackground);
var yellowBackground = styleObject(styleStrings.yellowBackground);
var magentaBackground = styleObject(styleStrings.magentaBackground);
var cyanBackground = styleObject(styleStrings.cyanBackground);
var lightBlackBackground = styleObject(styleStrings.lightBlackBackground);
var lightRedBackground = styleObject(styleStrings.lightRedBackground);
var lightGreenBackground = styleObject(styleStrings.lightGreenBackground);
var lightYellowBackground = styleObject(styleStrings.lightYellowBackground);
var lightBlueBackground = styleObject(styleStrings.lightBlueBackground);
var lightMagentaBackground = styleObject(styleStrings.lightMagentaBackground);
var lightCyanBackground = styleObject(styleStrings.lightCyanBackground);
var lightWhiteBackground = styleObject(styleStrings.lightWhiteBackground);
var gray = styleObject(styleStrings.gray);
var grey = styleObject(styleStrings.grey);
var lightGray = styleObject(styleStrings.lightGray);
var lightGrey = styleObject(styleStrings.lightGrey);
var grayBackground = styleObject(styleStrings.grayBackground);
var greyBackground = styleObject(styleStrings.greyBackground);
var lightGrayBackground = styleObject(styleStrings.lightGrayBackground);
var lightGreyBackground = styleObject(styleStrings.lightGreyBackground);
var colorSupportCache = {
  includesAnsi: null,
  includes256: null,
  includes16m: null
};
var Console = {
  // TODO: add signal handler
  // Deno.addSignalListener("SIGINT", (...args)=>{
  //     console.debug(`args is:`,args)
  // })
  log(...args2) {
    if (args2.length == 0) {
      console.log();
    }
    let [arg1, ...others] = args2.map((each2) => {
      if (each2 instanceof Object && each2[symbolForConsoleLog] instanceof Function) {
        return each2[symbolForConsoleLog]();
      }
      return each2;
    });
    if (typeof arg1 == "string") {
      arg1 = arg1.replace("%", "%%");
    }
    if (!isBrowserContext) {
      if (!Console.reliableColorSupport.includesAnsi) {
        arg1 = clearAnsiStylesFrom(arg1);
        others = others.map((each2) => {
          if (typeof each2 == "string") {
            return clearAnsiStylesFrom(each2);
          } else {
            return each2;
          }
        });
      }
      realConsole.log(arg1, ...others);
    } else {
      if (args2[0][symbolForConsoleLog] && typeof args2[0].styleString == "string") {
        realConsole.log(`%c${arg1}${others.map((each2) => `${each2}`).join("")}`, args2[0].styleString);
      } else {
        realConsole.log(arg1, ...others);
      }
    }
    return Console;
  },
  get env() {
    return env = env || new Proxy(
      Deno.env.toObject(),
      {
        // Object.keys
        ownKeys(target) {
          return Object.keys(Deno.env.toObject());
        },
        has(original, key) {
          if (typeof key === "symbol") {
            return false;
          } else {
            return Deno.env.get(key) !== void 0;
          }
        },
        get(original, key) {
          if (typeof key === "symbol") {
            return original[key];
          } else {
            return Deno.env.get(key);
          }
        },
        set(original, key, value) {
          original[key] = value;
          if (typeof key !== "symbol") {
            Deno.env.set(key, value);
          }
          return true;
        },
        deleteProperty(original, key) {
          if (typeof key === "symbol") {
            return void 0;
          } else {
            return Deno.env.delete(key);
          }
        }
      }
    );
  },
  disableColorIfNonIteractive: true,
  write: (text) => Deno.stdout.writeSync(text instanceof Uint8Array ? text : new TextEncoder().encode(text)),
  askFor: {
    // in the future once Deno.setRaw is stable, add a askFor.password using: https://github.com/caspervonb/deno-prompts
    line(question) {
      return prompt(question);
    },
    confirmation(question) {
      console.log(question);
      prompt("[use CTRL+C to quit, or press enter to continue]");
    },
    positiveIntegerOrZero(question) {
      while (1) {
        console.log(question);
        const answer = prompt(question);
        const asNumber = answer - 0;
        const isRealNumber = asNumber !== asNumber && asNumber * 2 !== asNumber;
        const isInteger = Math.round(asNumber) === asNumber;
        const isNonNegative = asNumber >= 0;
        if (isRealNumber && isInteger && isNonNegative) {
          return asNumber;
        } else {
          if (!isRealNumber) {
            console.log(`I don't think ${answer} is a real number, please try again`);
          }
          if (!isInteger) {
            console.log(`I don't think ${answer} is an integer, please try again`);
          }
          if (!isNonNegative) {
            console.log(`I don't think ${answer} is ≥ 0, please try again`);
          }
        }
      }
    },
    yesNo(question) {
      while (true) {
        let answer = prompt(question);
        const match = `${answer}`.match(/^ *(y|yes|n|no) *\n?$/i);
        if (match) {
          if (match[1][0] == "y" || match[1][0] == "Y") {
            return true;
          } else {
            return false;
          }
        } else {
          console.log("[ please respond with y/n, yes/no, or use CTRL+C to cancel ]");
        }
      }
    },
    oneOf(keyValues, question = "Please type one of the names from the list above") {
      if (keyValues instanceof Array) {
        keyValues = Object.fromEntries(keyValues.map((each2, index) => [index, each2]));
      }
      const keys = Object.keys(keyValues);
      if (keys.length == 0) {
        console.warn(`Tried to perform Console.askFor.oneOf(object) but the object was empty`);
        return void 0;
      }
      const longest = Math.max(keys.map((each2) => each2.length));
      while (true) {
        for (const [key, value] of Object.entries(keyValues)) {
          const valueAsString = h({ string: `${value}
`, by: " ".repeat(longest + 2), noLead: true });
          console.log(``, `${key}: ${valueAsString}`);
        }
        let answer = prompt(question);
        if (keys.includes(answer)) {
          return keyValues[answer];
        } else {
          console.log("\n\n[ please pick one of the listed names, or use CTRL+C to cancel ]");
        }
      }
    }
  },
  get paths() {
    const spliter = OperatingSystem.commonChecks.isWindows ? ";" : ":";
    return Deno.env.get("PATH").split(spliter);
  },
  get reliableColorSupport() {
    if (colorSupportCache.includesAnsi != null) {
      return colorSupportCache;
    }
    let terminalSupport;
    if (!Deno.isatty(0)) {
      terminalSupport = {
        includesAnsi: false,
        includes256: false,
        includes16m: false
      };
    } else if ("NO_COLOR" in Console.env) {
      terminalSupport = {
        includesAnsi: false,
        includes256: false,
        includes16m: false
      };
    } else {
      if (OperatingSystem.commonChecks.isWindows || OperatingSystem.commonChecks.isWsl) {
        if (Deno.env.get("WT_SESSION")) {
          terminalSupport = {
            includesAnsi: true,
            includes256: true,
            includes16m: true
          };
        } else {
          terminalSupport = {
            includesAnsi: false,
            includes256: false,
            includes16m: false
          };
        }
      } else {
        if ("TERM_PROGRAM" in Console.env) {
          const version3 = Number.parseInt((Console.env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
          if (Console.env.TERM_PROGRAM == "iTerm.app") {
            if (version3 >= 3) {
              terminalSupport = {
                includesAnsi: true,
                includes256: true,
                includes16m: true
              };
            } else {
              terminalSupport = {
                includesAnsi: true,
                includes256: true,
                includes16m: false
              };
            }
          } else if (Console.env.TERM_PROGRAM == "Apple_Terminal") {
            terminalSupport = {
              includesAnsi: true,
              includes256: true,
              includes16m: false
            };
          }
        }
        if (Console.env.TERM === "dumb") {
          terminalSupport = {
            includesAnsi: false,
            includes256: false,
            includes16m: false
          };
        } else if ("CI" in Console.env) {
          terminalSupport = {
            includesAnsi: ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE", "DRONE"].some((sign) => sign in Console.env) || Console.env.CI_NAME === "codeship",
            includes256: false,
            includes16m: false
          };
        } else if (Console.env.COLORTERM === "truecolor") {
          terminalSupport = {
            includesAnsi: true,
            includes256: true,
            includes16m: true
          };
        } else if (/-256(color)?$/i.test(Console.env.TERM)) {
          terminalSupport = {
            includesAnsi: true,
            includes256: true,
            includes16m: false
          };
        } else if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(Console.env.TERM)) {
          terminalSupport = {
            includesAnsi: true,
            includes256: false,
            includes16m: false
          };
        } else if ("COLORTERM" in Console.env) {
          terminalSupport = {
            includesAnsi: true,
            includes256: false,
            includes16m: false
          };
        } else {
          terminalSupport = {
            includesAnsi: false,
            includes256: false,
            includes16m: false
          };
        }
      }
    }
    colorSupportCache.includesAnsi = terminalSupport.includesAnsi;
    colorSupportCache.includes256 = terminalSupport.includes256;
    colorSupportCache.includes16m = terminalSupport.includes16m;
    return colorSupportCache;
  },
  clearScreen() {
    if (!isBrowserContext) {
      console.log("\x1B[2J");
    }
  }
};

// https://deno.land/std@0.128.0/_util/os.ts
var osType = (() => {
  const { Deno: Deno4 } = globalThis;
  if (typeof Deno4?.build?.os === "string") {
    return Deno4.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win") ?? false) {
    return "windows";
  }
  return "linux";
})();
var isWindows = osType === "windows";

// https://deno.land/std@0.128.0/path/win32.ts
var win32_exports = {};
__export(win32_exports, {
  basename: () => basename,
  delimiter: () => delimiter,
  dirname: () => dirname,
  extname: () => extname,
  format: () => format,
  fromFileUrl: () => fromFileUrl,
  isAbsolute: () => isAbsolute,
  join: () => join,
  normalize: () => normalize,
  parse: () => parse,
  relative: () => relative,
  resolve: () => resolve,
  sep: () => sep,
  toFileUrl: () => toFileUrl,
  toNamespacedPath: () => toNamespacedPath
});

// https://deno.land/std@0.128.0/path/_constants.ts
var CHAR_UPPERCASE_A = 65;
var CHAR_LOWERCASE_A = 97;
var CHAR_UPPERCASE_Z = 90;
var CHAR_LOWERCASE_Z = 122;
var CHAR_DOT = 46;
var CHAR_FORWARD_SLASH = 47;
var CHAR_BACKWARD_SLASH = 92;
var CHAR_COLON = 58;
var CHAR_QUESTION_MARK = 63;

// https://deno.land/std@0.128.0/path/_util.ts
function assertPath(path6) {
  if (typeof path6 !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path6)}`
    );
  }
}
function isPosixPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
}
function isPathSeparator(code) {
  return isPosixPathSeparator(code) || code === CHAR_BACKWARD_SLASH;
}
function isWindowsDeviceRoot(code) {
  return code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z || code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z;
}
function normalizeString(path6, allowAboveRoot, separator, isPathSeparator4) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i3 = 0, len = path6.length; i3 <= len; ++i3) {
    if (i3 < len) code = path6.charCodeAt(i3);
    else if (isPathSeparator4(code)) break;
    else code = CHAR_FORWARD_SLASH;
    if (isPathSeparator4(code)) {
      if (lastSlash === i3 - 1 || dots === 1) {
      } else if (lastSlash !== i3 - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i3;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i3;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += `${separator}..`;
          else res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) res += separator + path6.slice(lastSlash + 1, i3);
        else res = path6.slice(lastSlash + 1, i3);
        lastSegmentLength = i3 - lastSlash - 1;
      }
      lastSlash = i3;
      dots = 0;
    } else if (code === CHAR_DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep7, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir) return base;
  if (dir === pathObject.root) return dir + base;
  return dir + sep7 + base;
}
var WHITESPACE_ENCODINGS = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace(string) {
  return string.replaceAll(/[\s]/g, (c2) => {
    return WHITESPACE_ENCODINGS[c2] ?? c2;
  });
}

// https://deno.land/std@0.128.0/_util/assert.ts
var DenoStdInternalError2 = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert2(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError2(msg);
  }
}

// https://deno.land/std@0.128.0/path/win32.ts
var sep = "\\";
var delimiter = ";";
function resolve(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i3 = pathSegments.length - 1; i3 >= -1; i3--) {
    let path6;
    const { Deno: Deno4 } = globalThis;
    if (i3 >= 0) {
      path6 = pathSegments[i3];
    } else if (!resolvedDevice) {
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path6 = Deno4.cwd();
    } else {
      if (typeof Deno4?.env?.get !== "function" || typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path6 = Deno4.cwd();
      if (path6 === void 0 || path6.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path6 = `${resolvedDevice}\\`;
      }
    }
    assertPath(path6);
    const len = path6.length;
    if (len === 0) continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute7 = false;
    const code = path6.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator(code)) {
        isAbsolute7 = true;
        if (isPathSeparator(path6.charCodeAt(1))) {
          let j3 = 2;
          let last = j3;
          for (; j3 < len; ++j3) {
            if (isPathSeparator(path6.charCodeAt(j3))) break;
          }
          if (j3 < len && j3 !== last) {
            const firstPart = path6.slice(last, j3);
            last = j3;
            for (; j3 < len; ++j3) {
              if (!isPathSeparator(path6.charCodeAt(j3))) break;
            }
            if (j3 < len && j3 !== last) {
              last = j3;
              for (; j3 < len; ++j3) {
                if (isPathSeparator(path6.charCodeAt(j3))) break;
              }
              if (j3 === len) {
                device = `\\\\${firstPart}\\${path6.slice(last)}`;
                rootEnd = j3;
              } else if (j3 !== last) {
                device = `\\\\${firstPart}\\${path6.slice(last, j3)}`;
                rootEnd = j3;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot(code)) {
        if (path6.charCodeAt(1) === CHAR_COLON) {
          device = path6.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator(path6.charCodeAt(2))) {
              isAbsolute7 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator(code)) {
      rootEnd = 1;
      isAbsolute7 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path6.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute7;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0) break;
  }
  resolvedTail = normalizeString(
    resolvedTail,
    !resolvedAbsolute,
    "\\",
    isPathSeparator
  );
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize(path6) {
  assertPath(path6);
  const len = path6.length;
  if (len === 0) return ".";
  let rootEnd = 0;
  let device;
  let isAbsolute7 = false;
  const code = path6.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      isAbsolute7 = true;
      if (isPathSeparator(path6.charCodeAt(1))) {
        let j3 = 2;
        let last = j3;
        for (; j3 < len; ++j3) {
          if (isPathSeparator(path6.charCodeAt(j3))) break;
        }
        if (j3 < len && j3 !== last) {
          const firstPart = path6.slice(last, j3);
          last = j3;
          for (; j3 < len; ++j3) {
            if (!isPathSeparator(path6.charCodeAt(j3))) break;
          }
          if (j3 < len && j3 !== last) {
            last = j3;
            for (; j3 < len; ++j3) {
              if (isPathSeparator(path6.charCodeAt(j3))) break;
            }
            if (j3 === len) {
              return `\\\\${firstPart}\\${path6.slice(last)}\\`;
            } else if (j3 !== last) {
              device = `\\\\${firstPart}\\${path6.slice(last, j3)}`;
              rootEnd = j3;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path6.charCodeAt(1) === CHAR_COLON) {
        device = path6.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path6.charCodeAt(2))) {
            isAbsolute7 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator(code)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString(
      path6.slice(rootEnd),
      !isAbsolute7,
      "\\",
      isPathSeparator
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute7) tail = ".";
  if (tail.length > 0 && isPathSeparator(path6.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute7) {
      if (tail.length > 0) return `\\${tail}`;
      else return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute7) {
    if (tail.length > 0) return `${device}\\${tail}`;
    else return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}
function isAbsolute(path6) {
  assertPath(path6);
  const len = path6.length;
  if (len === 0) return false;
  const code = path6.charCodeAt(0);
  if (isPathSeparator(code)) {
    return true;
  } else if (isWindowsDeviceRoot(code)) {
    if (len > 2 && path6.charCodeAt(1) === CHAR_COLON) {
      if (isPathSeparator(path6.charCodeAt(2))) return true;
    }
  }
  return false;
}
function join(...paths) {
  const pathsCount = paths.length;
  if (pathsCount === 0) return ".";
  let joined;
  let firstPart = null;
  for (let i3 = 0; i3 < pathsCount; ++i3) {
    const path6 = paths[i3];
    assertPath(path6);
    if (path6.length > 0) {
      if (joined === void 0) joined = firstPart = path6;
      else joined += `\\${path6}`;
    }
  }
  if (joined === void 0) return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert2(firstPart != null);
  if (isPathSeparator(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator(firstPart.charCodeAt(2))) ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator(joined.charCodeAt(slashCount))) break;
    }
    if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize(joined);
}
function relative(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to) return "";
  const fromOrig = resolve(from);
  const toOrig = resolve(to);
  if (fromOrig === toOrig) return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to) return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH) break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH) break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i3 = 0;
  for (; i3 <= length; ++i3) {
    if (i3 === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i3) === CHAR_BACKWARD_SLASH) {
          return toOrig.slice(toStart + i3 + 1);
        } else if (i3 === 2) {
          return toOrig.slice(toStart + i3);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i3) === CHAR_BACKWARD_SLASH) {
          lastCommonSep = i3;
        } else if (i3 === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i3);
    const toCode = to.charCodeAt(toStart + i3);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_BACKWARD_SLASH) lastCommonSep = i3;
  }
  if (i3 !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1) lastCommonSep = 0;
  for (i3 = fromStart + lastCommonSep + 1; i3 <= fromEnd; ++i3) {
    if (i3 === fromEnd || from.charCodeAt(i3) === CHAR_BACKWARD_SLASH) {
      if (out.length === 0) out += "..";
      else out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
function toNamespacedPath(path6) {
  if (typeof path6 !== "string") return path6;
  if (path6.length === 0) return "";
  const resolvedPath = resolve(path6);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
        const code = resolvedPath.charCodeAt(2);
        if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
      if (resolvedPath.charCodeAt(1) === CHAR_COLON && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path6;
}
function dirname(path6) {
  assertPath(path6);
  const len = path6.length;
  if (len === 0) return ".";
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code = path6.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      rootEnd = offset = 1;
      if (isPathSeparator(path6.charCodeAt(1))) {
        let j3 = 2;
        let last = j3;
        for (; j3 < len; ++j3) {
          if (isPathSeparator(path6.charCodeAt(j3))) break;
        }
        if (j3 < len && j3 !== last) {
          last = j3;
          for (; j3 < len; ++j3) {
            if (!isPathSeparator(path6.charCodeAt(j3))) break;
          }
          if (j3 < len && j3 !== last) {
            last = j3;
            for (; j3 < len; ++j3) {
              if (isPathSeparator(path6.charCodeAt(j3))) break;
            }
            if (j3 === len) {
              return path6;
            }
            if (j3 !== last) {
              rootEnd = offset = j3 + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path6.charCodeAt(1) === CHAR_COLON) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator(path6.charCodeAt(2))) rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator(code)) {
    return path6;
  }
  for (let i3 = len - 1; i3 >= offset; --i3) {
    if (isPathSeparator(path6.charCodeAt(i3))) {
      if (!matchedSlash) {
        end = i3;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1) return ".";
    else end = rootEnd;
  }
  return path6.slice(0, end);
}
function basename(path6, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path6);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i3;
  if (path6.length >= 2) {
    const drive = path6.charCodeAt(0);
    if (isWindowsDeviceRoot(drive)) {
      if (path6.charCodeAt(1) === CHAR_COLON) start = 2;
    }
  }
  if (ext !== void 0 && ext.length > 0 && ext.length <= path6.length) {
    if (ext.length === path6.length && ext === path6) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i3 = path6.length - 1; i3 >= start; --i3) {
      const code = path6.charCodeAt(i3);
      if (isPathSeparator(code)) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i3 + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i3;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path6.length;
    return path6.slice(start, end);
  } else {
    for (i3 = path6.length - 1; i3 >= start; --i3) {
      if (isPathSeparator(path6.charCodeAt(i3))) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i3 + 1;
      }
    }
    if (end === -1) return "";
    return path6.slice(start, end);
  }
}
function extname(path6) {
  assertPath(path6);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path6.length >= 2 && path6.charCodeAt(1) === CHAR_COLON && isWindowsDeviceRoot(path6.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i3 = path6.length - 1; i3 >= start; --i3) {
    const code = path6.charCodeAt(i3);
    if (isPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path6.slice(startDot, end);
}
function format(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format("\\", pathObject);
}
function parse(path6) {
  assertPath(path6);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  const len = path6.length;
  if (len === 0) return ret;
  let rootEnd = 0;
  let code = path6.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      rootEnd = 1;
      if (isPathSeparator(path6.charCodeAt(1))) {
        let j3 = 2;
        let last = j3;
        for (; j3 < len; ++j3) {
          if (isPathSeparator(path6.charCodeAt(j3))) break;
        }
        if (j3 < len && j3 !== last) {
          last = j3;
          for (; j3 < len; ++j3) {
            if (!isPathSeparator(path6.charCodeAt(j3))) break;
          }
          if (j3 < len && j3 !== last) {
            last = j3;
            for (; j3 < len; ++j3) {
              if (isPathSeparator(path6.charCodeAt(j3))) break;
            }
            if (j3 === len) {
              rootEnd = j3;
            } else if (j3 !== last) {
              rootEnd = j3 + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path6.charCodeAt(1) === CHAR_COLON) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path6.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path6;
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path6;
          return ret;
        }
      }
    }
  } else if (isPathSeparator(code)) {
    ret.root = ret.dir = path6;
    return ret;
  }
  if (rootEnd > 0) ret.root = path6.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i3 = path6.length - 1;
  let preDotState = 0;
  for (; i3 >= rootEnd; --i3) {
    code = path6.charCodeAt(i3);
    if (isPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path6.slice(startPart, end);
    }
  } else {
    ret.name = path6.slice(startPart, startDot);
    ret.base = path6.slice(startPart, end);
    ret.ext = path6.slice(startDot, end);
  }
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path6.slice(0, startPart - 1);
  } else ret.dir = ret.root;
  return ret;
}
function fromFileUrl(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  let path6 = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname != "") {
    path6 = `\\\\${url.hostname}${path6}`;
  }
  return path6;
}
function toFileUrl(path6) {
  if (!isAbsolute(path6)) {
    throw new TypeError("Must be an absolute path.");
  }
  const [, hostname2, pathname] = path6.match(
    /^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/
  );
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
  if (hostname2 != null && hostname2 != "localhost") {
    url.hostname = hostname2;
    if (!url.hostname) {
      throw new TypeError("Invalid hostname.");
    }
  }
  return url;
}

// https://deno.land/std@0.128.0/path/posix.ts
var posix_exports = {};
__export(posix_exports, {
  basename: () => basename2,
  delimiter: () => delimiter2,
  dirname: () => dirname2,
  extname: () => extname2,
  format: () => format2,
  fromFileUrl: () => fromFileUrl2,
  isAbsolute: () => isAbsolute2,
  join: () => join2,
  normalize: () => normalize2,
  parse: () => parse2,
  relative: () => relative2,
  resolve: () => resolve2,
  sep: () => sep2,
  toFileUrl: () => toFileUrl2,
  toNamespacedPath: () => toNamespacedPath2
});
var sep2 = "/";
var delimiter2 = ":";
function resolve2(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i3 = pathSegments.length - 1; i3 >= -1 && !resolvedAbsolute; i3--) {
    let path6;
    if (i3 >= 0) path6 = pathSegments[i3];
    else {
      const { Deno: Deno4 } = globalThis;
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path6 = Deno4.cwd();
    }
    assertPath(path6);
    if (path6.length === 0) {
      continue;
    }
    resolvedPath = `${path6}/${resolvedPath}`;
    resolvedAbsolute = path6.charCodeAt(0) === CHAR_FORWARD_SLASH;
  }
  resolvedPath = normalizeString(
    resolvedPath,
    !resolvedAbsolute,
    "/",
    isPosixPathSeparator
  );
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0) return `/${resolvedPath}`;
    else return "/";
  } else if (resolvedPath.length > 0) return resolvedPath;
  else return ".";
}
function normalize2(path6) {
  assertPath(path6);
  if (path6.length === 0) return ".";
  const isAbsolute7 = path6.charCodeAt(0) === CHAR_FORWARD_SLASH;
  const trailingSeparator = path6.charCodeAt(path6.length - 1) === CHAR_FORWARD_SLASH;
  path6 = normalizeString(path6, !isAbsolute7, "/", isPosixPathSeparator);
  if (path6.length === 0 && !isAbsolute7) path6 = ".";
  if (path6.length > 0 && trailingSeparator) path6 += "/";
  if (isAbsolute7) return `/${path6}`;
  return path6;
}
function isAbsolute2(path6) {
  assertPath(path6);
  return path6.length > 0 && path6.charCodeAt(0) === CHAR_FORWARD_SLASH;
}
function join2(...paths) {
  if (paths.length === 0) return ".";
  let joined;
  for (let i3 = 0, len = paths.length; i3 < len; ++i3) {
    const path6 = paths[i3];
    assertPath(path6);
    if (path6.length > 0) {
      if (!joined) joined = path6;
      else joined += `/${path6}`;
    }
  }
  if (!joined) return ".";
  return normalize2(joined);
}
function relative2(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to) return "";
  from = resolve2(from);
  to = resolve2(to);
  if (from === to) return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i3 = 0;
  for (; i3 <= length; ++i3) {
    if (i3 === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i3) === CHAR_FORWARD_SLASH) {
          return to.slice(toStart + i3 + 1);
        } else if (i3 === 0) {
          return to.slice(toStart + i3);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i3) === CHAR_FORWARD_SLASH) {
          lastCommonSep = i3;
        } else if (i3 === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i3);
    const toCode = to.charCodeAt(toStart + i3);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_FORWARD_SLASH) lastCommonSep = i3;
  }
  let out = "";
  for (i3 = fromStart + lastCommonSep + 1; i3 <= fromEnd; ++i3) {
    if (i3 === fromEnd || from.charCodeAt(i3) === CHAR_FORWARD_SLASH) {
      if (out.length === 0) out += "..";
      else out += "/..";
    }
  }
  if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH) ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath2(path6) {
  return path6;
}
function dirname2(path6) {
  assertPath(path6);
  if (path6.length === 0) return ".";
  const hasRoot = path6.charCodeAt(0) === CHAR_FORWARD_SLASH;
  let end = -1;
  let matchedSlash = true;
  for (let i3 = path6.length - 1; i3 >= 1; --i3) {
    if (path6.charCodeAt(i3) === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        end = i3;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) return hasRoot ? "/" : ".";
  if (hasRoot && end === 1) return "//";
  return path6.slice(0, end);
}
function basename2(path6, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path6);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i3;
  if (ext !== void 0 && ext.length > 0 && ext.length <= path6.length) {
    if (ext.length === path6.length && ext === path6) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i3 = path6.length - 1; i3 >= 0; --i3) {
      const code = path6.charCodeAt(i3);
      if (code === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i3 + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i3;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path6.length;
    return path6.slice(start, end);
  } else {
    for (i3 = path6.length - 1; i3 >= 0; --i3) {
      if (path6.charCodeAt(i3) === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i3 + 1;
      }
    }
    if (end === -1) return "";
    return path6.slice(start, end);
  }
}
function extname2(path6) {
  assertPath(path6);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i3 = path6.length - 1; i3 >= 0; --i3) {
    const code = path6.charCodeAt(i3);
    if (code === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path6.slice(startDot, end);
}
function format2(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format("/", pathObject);
}
function parse2(path6) {
  assertPath(path6);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path6.length === 0) return ret;
  const isAbsolute7 = path6.charCodeAt(0) === CHAR_FORWARD_SLASH;
  let start;
  if (isAbsolute7) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i3 = path6.length - 1;
  let preDotState = 0;
  for (; i3 >= start; --i3) {
    const code = path6.charCodeAt(i3);
    if (code === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute7) {
        ret.base = ret.name = path6.slice(1, end);
      } else {
        ret.base = ret.name = path6.slice(startPart, end);
      }
    }
  } else {
    if (startPart === 0 && isAbsolute7) {
      ret.name = path6.slice(1, startDot);
      ret.base = path6.slice(1, end);
    } else {
      ret.name = path6.slice(startPart, startDot);
      ret.base = path6.slice(startPart, end);
    }
    ret.ext = path6.slice(startDot, end);
  }
  if (startPart > 0) ret.dir = path6.slice(0, startPart - 1);
  else if (isAbsolute7) ret.dir = "/";
  return ret;
}
function fromFileUrl2(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function toFileUrl2(path6) {
  if (!isAbsolute2(path6)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(
    path6.replace(/%/g, "%25").replace(/\\/g, "%5C")
  );
  return url;
}

// https://deno.land/std@0.128.0/path/glob.ts
var path = isWindows ? win32_exports : posix_exports;
var { join: join3, normalize: normalize3 } = path;

// https://deno.land/std@0.128.0/path/mod.ts
var path2 = isWindows ? win32_exports : posix_exports;
var {
  basename: basename3,
  delimiter: delimiter3,
  dirname: dirname3,
  extname: extname3,
  format: format3,
  fromFileUrl: fromFileUrl3,
  isAbsolute: isAbsolute3,
  join: join4,
  normalize: normalize4,
  parse: parse3,
  relative: relative3,
  resolve: resolve3,
  sep: sep3,
  toFileUrl: toFileUrl3,
  toNamespacedPath: toNamespacedPath3
} = path2;

// https://deno.land/std@0.133.0/_util/os.ts
var osType2 = (() => {
  const { Deno: Deno4 } = globalThis;
  if (typeof Deno4?.build?.os === "string") {
    return Deno4.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win") ?? false) {
    return "windows";
  }
  return "linux";
})();
var isWindows2 = osType2 === "windows";

// https://deno.land/std@0.133.0/path/win32.ts
var win32_exports2 = {};
__export(win32_exports2, {
  basename: () => basename4,
  delimiter: () => delimiter4,
  dirname: () => dirname4,
  extname: () => extname4,
  format: () => format4,
  fromFileUrl: () => fromFileUrl4,
  isAbsolute: () => isAbsolute4,
  join: () => join5,
  normalize: () => normalize5,
  parse: () => parse4,
  relative: () => relative4,
  resolve: () => resolve4,
  sep: () => sep4,
  toFileUrl: () => toFileUrl4,
  toNamespacedPath: () => toNamespacedPath4
});

// https://deno.land/std@0.133.0/path/_constants.ts
var CHAR_UPPERCASE_A2 = 65;
var CHAR_LOWERCASE_A2 = 97;
var CHAR_UPPERCASE_Z2 = 90;
var CHAR_LOWERCASE_Z2 = 122;
var CHAR_DOT2 = 46;
var CHAR_FORWARD_SLASH2 = 47;
var CHAR_BACKWARD_SLASH2 = 92;
var CHAR_COLON2 = 58;
var CHAR_QUESTION_MARK2 = 63;

// https://deno.land/std@0.133.0/path/_util.ts
function assertPath2(path6) {
  if (typeof path6 !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path6)}`
    );
  }
}
function isPosixPathSeparator2(code) {
  return code === CHAR_FORWARD_SLASH2;
}
function isPathSeparator2(code) {
  return isPosixPathSeparator2(code) || code === CHAR_BACKWARD_SLASH2;
}
function isWindowsDeviceRoot2(code) {
  return code >= CHAR_LOWERCASE_A2 && code <= CHAR_LOWERCASE_Z2 || code >= CHAR_UPPERCASE_A2 && code <= CHAR_UPPERCASE_Z2;
}
function normalizeString2(path6, allowAboveRoot, separator, isPathSeparator4) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i3 = 0, len = path6.length; i3 <= len; ++i3) {
    if (i3 < len) code = path6.charCodeAt(i3);
    else if (isPathSeparator4(code)) break;
    else code = CHAR_FORWARD_SLASH2;
    if (isPathSeparator4(code)) {
      if (lastSlash === i3 - 1 || dots === 1) {
      } else if (lastSlash !== i3 - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT2 || res.charCodeAt(res.length - 2) !== CHAR_DOT2) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i3;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i3;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += `${separator}..`;
          else res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) res += separator + path6.slice(lastSlash + 1, i3);
        else res = path6.slice(lastSlash + 1, i3);
        lastSegmentLength = i3 - lastSlash - 1;
      }
      lastSlash = i3;
      dots = 0;
    } else if (code === CHAR_DOT2 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format2(sep7, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir) return base;
  if (dir === pathObject.root) return dir + base;
  return dir + sep7 + base;
}
var WHITESPACE_ENCODINGS2 = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace2(string) {
  return string.replaceAll(/[\s]/g, (c2) => {
    return WHITESPACE_ENCODINGS2[c2] ?? c2;
  });
}

// https://deno.land/std@0.133.0/_util/assert.ts
var DenoStdInternalError3 = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert3(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError3(msg);
  }
}

// https://deno.land/std@0.133.0/path/win32.ts
var sep4 = "\\";
var delimiter4 = ";";
function resolve4(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i3 = pathSegments.length - 1; i3 >= -1; i3--) {
    let path6;
    const { Deno: Deno4 } = globalThis;
    if (i3 >= 0) {
      path6 = pathSegments[i3];
    } else if (!resolvedDevice) {
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path6 = Deno4.cwd();
    } else {
      if (typeof Deno4?.env?.get !== "function" || typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path6 = Deno4.cwd();
      if (path6 === void 0 || path6.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path6 = `${resolvedDevice}\\`;
      }
    }
    assertPath2(path6);
    const len = path6.length;
    if (len === 0) continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute7 = false;
    const code = path6.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator2(code)) {
        isAbsolute7 = true;
        if (isPathSeparator2(path6.charCodeAt(1))) {
          let j3 = 2;
          let last = j3;
          for (; j3 < len; ++j3) {
            if (isPathSeparator2(path6.charCodeAt(j3))) break;
          }
          if (j3 < len && j3 !== last) {
            const firstPart = path6.slice(last, j3);
            last = j3;
            for (; j3 < len; ++j3) {
              if (!isPathSeparator2(path6.charCodeAt(j3))) break;
            }
            if (j3 < len && j3 !== last) {
              last = j3;
              for (; j3 < len; ++j3) {
                if (isPathSeparator2(path6.charCodeAt(j3))) break;
              }
              if (j3 === len) {
                device = `\\\\${firstPart}\\${path6.slice(last)}`;
                rootEnd = j3;
              } else if (j3 !== last) {
                device = `\\\\${firstPart}\\${path6.slice(last, j3)}`;
                rootEnd = j3;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot2(code)) {
        if (path6.charCodeAt(1) === CHAR_COLON2) {
          device = path6.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator2(path6.charCodeAt(2))) {
              isAbsolute7 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator2(code)) {
      rootEnd = 1;
      isAbsolute7 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path6.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute7;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0) break;
  }
  resolvedTail = normalizeString2(
    resolvedTail,
    !resolvedAbsolute,
    "\\",
    isPathSeparator2
  );
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize5(path6) {
  assertPath2(path6);
  const len = path6.length;
  if (len === 0) return ".";
  let rootEnd = 0;
  let device;
  let isAbsolute7 = false;
  const code = path6.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code)) {
      isAbsolute7 = true;
      if (isPathSeparator2(path6.charCodeAt(1))) {
        let j3 = 2;
        let last = j3;
        for (; j3 < len; ++j3) {
          if (isPathSeparator2(path6.charCodeAt(j3))) break;
        }
        if (j3 < len && j3 !== last) {
          const firstPart = path6.slice(last, j3);
          last = j3;
          for (; j3 < len; ++j3) {
            if (!isPathSeparator2(path6.charCodeAt(j3))) break;
          }
          if (j3 < len && j3 !== last) {
            last = j3;
            for (; j3 < len; ++j3) {
              if (isPathSeparator2(path6.charCodeAt(j3))) break;
            }
            if (j3 === len) {
              return `\\\\${firstPart}\\${path6.slice(last)}\\`;
            } else if (j3 !== last) {
              device = `\\\\${firstPart}\\${path6.slice(last, j3)}`;
              rootEnd = j3;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot2(code)) {
      if (path6.charCodeAt(1) === CHAR_COLON2) {
        device = path6.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator2(path6.charCodeAt(2))) {
            isAbsolute7 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator2(code)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString2(
      path6.slice(rootEnd),
      !isAbsolute7,
      "\\",
      isPathSeparator2
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute7) tail = ".";
  if (tail.length > 0 && isPathSeparator2(path6.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute7) {
      if (tail.length > 0) return `\\${tail}`;
      else return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute7) {
    if (tail.length > 0) return `${device}\\${tail}`;
    else return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}
function isAbsolute4(path6) {
  assertPath2(path6);
  const len = path6.length;
  if (len === 0) return false;
  const code = path6.charCodeAt(0);
  if (isPathSeparator2(code)) {
    return true;
  } else if (isWindowsDeviceRoot2(code)) {
    if (len > 2 && path6.charCodeAt(1) === CHAR_COLON2) {
      if (isPathSeparator2(path6.charCodeAt(2))) return true;
    }
  }
  return false;
}
function join5(...paths) {
  const pathsCount = paths.length;
  if (pathsCount === 0) return ".";
  let joined;
  let firstPart = null;
  for (let i3 = 0; i3 < pathsCount; ++i3) {
    const path6 = paths[i3];
    assertPath2(path6);
    if (path6.length > 0) {
      if (joined === void 0) joined = firstPart = path6;
      else joined += `\\${path6}`;
    }
  }
  if (joined === void 0) return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert3(firstPart != null);
  if (isPathSeparator2(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator2(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator2(firstPart.charCodeAt(2))) ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator2(joined.charCodeAt(slashCount))) break;
    }
    if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize5(joined);
}
function relative4(from, to) {
  assertPath2(from);
  assertPath2(to);
  if (from === to) return "";
  const fromOrig = resolve4(from);
  const toOrig = resolve4(to);
  if (fromOrig === toOrig) return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to) return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH2) break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH2) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH2) break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH2) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i3 = 0;
  for (; i3 <= length; ++i3) {
    if (i3 === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i3) === CHAR_BACKWARD_SLASH2) {
          return toOrig.slice(toStart + i3 + 1);
        } else if (i3 === 2) {
          return toOrig.slice(toStart + i3);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i3) === CHAR_BACKWARD_SLASH2) {
          lastCommonSep = i3;
        } else if (i3 === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i3);
    const toCode = to.charCodeAt(toStart + i3);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_BACKWARD_SLASH2) lastCommonSep = i3;
  }
  if (i3 !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1) lastCommonSep = 0;
  for (i3 = fromStart + lastCommonSep + 1; i3 <= fromEnd; ++i3) {
    if (i3 === fromEnd || from.charCodeAt(i3) === CHAR_BACKWARD_SLASH2) {
      if (out.length === 0) out += "..";
      else out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH2) ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
function toNamespacedPath4(path6) {
  if (typeof path6 !== "string") return path6;
  if (path6.length === 0) return "";
  const resolvedPath = resolve4(path6);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH2) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH2) {
        const code = resolvedPath.charCodeAt(2);
        if (code !== CHAR_QUESTION_MARK2 && code !== CHAR_DOT2) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot2(resolvedPath.charCodeAt(0))) {
      if (resolvedPath.charCodeAt(1) === CHAR_COLON2 && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH2) {
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path6;
}
function dirname4(path6) {
  assertPath2(path6);
  const len = path6.length;
  if (len === 0) return ".";
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code = path6.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code)) {
      rootEnd = offset = 1;
      if (isPathSeparator2(path6.charCodeAt(1))) {
        let j3 = 2;
        let last = j3;
        for (; j3 < len; ++j3) {
          if (isPathSeparator2(path6.charCodeAt(j3))) break;
        }
        if (j3 < len && j3 !== last) {
          last = j3;
          for (; j3 < len; ++j3) {
            if (!isPathSeparator2(path6.charCodeAt(j3))) break;
          }
          if (j3 < len && j3 !== last) {
            last = j3;
            for (; j3 < len; ++j3) {
              if (isPathSeparator2(path6.charCodeAt(j3))) break;
            }
            if (j3 === len) {
              return path6;
            }
            if (j3 !== last) {
              rootEnd = offset = j3 + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot2(code)) {
      if (path6.charCodeAt(1) === CHAR_COLON2) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator2(path6.charCodeAt(2))) rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator2(code)) {
    return path6;
  }
  for (let i3 = len - 1; i3 >= offset; --i3) {
    if (isPathSeparator2(path6.charCodeAt(i3))) {
      if (!matchedSlash) {
        end = i3;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1) return ".";
    else end = rootEnd;
  }
  return path6.slice(0, end);
}
function basename4(path6, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath2(path6);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i3;
  if (path6.length >= 2) {
    const drive = path6.charCodeAt(0);
    if (isWindowsDeviceRoot2(drive)) {
      if (path6.charCodeAt(1) === CHAR_COLON2) start = 2;
    }
  }
  if (ext !== void 0 && ext.length > 0 && ext.length <= path6.length) {
    if (ext.length === path6.length && ext === path6) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i3 = path6.length - 1; i3 >= start; --i3) {
      const code = path6.charCodeAt(i3);
      if (isPathSeparator2(code)) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i3 + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i3;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path6.length;
    return path6.slice(start, end);
  } else {
    for (i3 = path6.length - 1; i3 >= start; --i3) {
      if (isPathSeparator2(path6.charCodeAt(i3))) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i3 + 1;
      }
    }
    if (end === -1) return "";
    return path6.slice(start, end);
  }
}
function extname4(path6) {
  assertPath2(path6);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path6.length >= 2 && path6.charCodeAt(1) === CHAR_COLON2 && isWindowsDeviceRoot2(path6.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i3 = path6.length - 1; i3 >= start; --i3) {
    const code = path6.charCodeAt(i3);
    if (isPathSeparator2(code)) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path6.slice(startDot, end);
}
function format4(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format2("\\", pathObject);
}
function parse4(path6) {
  assertPath2(path6);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  const len = path6.length;
  if (len === 0) return ret;
  let rootEnd = 0;
  let code = path6.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code)) {
      rootEnd = 1;
      if (isPathSeparator2(path6.charCodeAt(1))) {
        let j3 = 2;
        let last = j3;
        for (; j3 < len; ++j3) {
          if (isPathSeparator2(path6.charCodeAt(j3))) break;
        }
        if (j3 < len && j3 !== last) {
          last = j3;
          for (; j3 < len; ++j3) {
            if (!isPathSeparator2(path6.charCodeAt(j3))) break;
          }
          if (j3 < len && j3 !== last) {
            last = j3;
            for (; j3 < len; ++j3) {
              if (isPathSeparator2(path6.charCodeAt(j3))) break;
            }
            if (j3 === len) {
              rootEnd = j3;
            } else if (j3 !== last) {
              rootEnd = j3 + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot2(code)) {
      if (path6.charCodeAt(1) === CHAR_COLON2) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator2(path6.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path6;
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path6;
          return ret;
        }
      }
    }
  } else if (isPathSeparator2(code)) {
    ret.root = ret.dir = path6;
    return ret;
  }
  if (rootEnd > 0) ret.root = path6.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i3 = path6.length - 1;
  let preDotState = 0;
  for (; i3 >= rootEnd; --i3) {
    code = path6.charCodeAt(i3);
    if (isPathSeparator2(code)) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path6.slice(startPart, end);
    }
  } else {
    ret.name = path6.slice(startPart, startDot);
    ret.base = path6.slice(startPart, end);
    ret.ext = path6.slice(startDot, end);
  }
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path6.slice(0, startPart - 1);
  } else ret.dir = ret.root;
  return ret;
}
function fromFileUrl4(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  let path6 = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname != "") {
    path6 = `\\\\${url.hostname}${path6}`;
  }
  return path6;
}
function toFileUrl4(path6) {
  if (!isAbsolute4(path6)) {
    throw new TypeError("Must be an absolute path.");
  }
  const [, hostname2, pathname] = path6.match(
    /^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/
  );
  const url = new URL("file:///");
  url.pathname = encodeWhitespace2(pathname.replace(/%/g, "%25"));
  if (hostname2 != null && hostname2 != "localhost") {
    url.hostname = hostname2;
    if (!url.hostname) {
      throw new TypeError("Invalid hostname.");
    }
  }
  return url;
}

// https://deno.land/std@0.133.0/path/posix.ts
var posix_exports2 = {};
__export(posix_exports2, {
  basename: () => basename5,
  delimiter: () => delimiter5,
  dirname: () => dirname5,
  extname: () => extname5,
  format: () => format5,
  fromFileUrl: () => fromFileUrl5,
  isAbsolute: () => isAbsolute5,
  join: () => join6,
  normalize: () => normalize6,
  parse: () => parse5,
  relative: () => relative5,
  resolve: () => resolve5,
  sep: () => sep5,
  toFileUrl: () => toFileUrl5,
  toNamespacedPath: () => toNamespacedPath5
});
var sep5 = "/";
var delimiter5 = ":";
function resolve5(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i3 = pathSegments.length - 1; i3 >= -1 && !resolvedAbsolute; i3--) {
    let path6;
    if (i3 >= 0) path6 = pathSegments[i3];
    else {
      const { Deno: Deno4 } = globalThis;
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path6 = Deno4.cwd();
    }
    assertPath2(path6);
    if (path6.length === 0) {
      continue;
    }
    resolvedPath = `${path6}/${resolvedPath}`;
    resolvedAbsolute = path6.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  }
  resolvedPath = normalizeString2(
    resolvedPath,
    !resolvedAbsolute,
    "/",
    isPosixPathSeparator2
  );
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0) return `/${resolvedPath}`;
    else return "/";
  } else if (resolvedPath.length > 0) return resolvedPath;
  else return ".";
}
function normalize6(path6) {
  assertPath2(path6);
  if (path6.length === 0) return ".";
  const isAbsolute7 = path6.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  const trailingSeparator = path6.charCodeAt(path6.length - 1) === CHAR_FORWARD_SLASH2;
  path6 = normalizeString2(path6, !isAbsolute7, "/", isPosixPathSeparator2);
  if (path6.length === 0 && !isAbsolute7) path6 = ".";
  if (path6.length > 0 && trailingSeparator) path6 += "/";
  if (isAbsolute7) return `/${path6}`;
  return path6;
}
function isAbsolute5(path6) {
  assertPath2(path6);
  return path6.length > 0 && path6.charCodeAt(0) === CHAR_FORWARD_SLASH2;
}
function join6(...paths) {
  if (paths.length === 0) return ".";
  let joined;
  for (let i3 = 0, len = paths.length; i3 < len; ++i3) {
    const path6 = paths[i3];
    assertPath2(path6);
    if (path6.length > 0) {
      if (!joined) joined = path6;
      else joined += `/${path6}`;
    }
  }
  if (!joined) return ".";
  return normalize6(joined);
}
function relative5(from, to) {
  assertPath2(from);
  assertPath2(to);
  if (from === to) return "";
  from = resolve5(from);
  to = resolve5(to);
  if (from === to) return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH2) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH2) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i3 = 0;
  for (; i3 <= length; ++i3) {
    if (i3 === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i3) === CHAR_FORWARD_SLASH2) {
          return to.slice(toStart + i3 + 1);
        } else if (i3 === 0) {
          return to.slice(toStart + i3);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i3) === CHAR_FORWARD_SLASH2) {
          lastCommonSep = i3;
        } else if (i3 === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i3);
    const toCode = to.charCodeAt(toStart + i3);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_FORWARD_SLASH2) lastCommonSep = i3;
  }
  let out = "";
  for (i3 = fromStart + lastCommonSep + 1; i3 <= fromEnd; ++i3) {
    if (i3 === fromEnd || from.charCodeAt(i3) === CHAR_FORWARD_SLASH2) {
      if (out.length === 0) out += "..";
      else out += "/..";
    }
  }
  if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH2) ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath5(path6) {
  return path6;
}
function dirname5(path6) {
  assertPath2(path6);
  if (path6.length === 0) return ".";
  const hasRoot = path6.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  let end = -1;
  let matchedSlash = true;
  for (let i3 = path6.length - 1; i3 >= 1; --i3) {
    if (path6.charCodeAt(i3) === CHAR_FORWARD_SLASH2) {
      if (!matchedSlash) {
        end = i3;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) return hasRoot ? "/" : ".";
  if (hasRoot && end === 1) return "//";
  return path6.slice(0, end);
}
function basename5(path6, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath2(path6);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i3;
  if (ext !== void 0 && ext.length > 0 && ext.length <= path6.length) {
    if (ext.length === path6.length && ext === path6) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i3 = path6.length - 1; i3 >= 0; --i3) {
      const code = path6.charCodeAt(i3);
      if (code === CHAR_FORWARD_SLASH2) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i3 + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i3;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path6.length;
    return path6.slice(start, end);
  } else {
    for (i3 = path6.length - 1; i3 >= 0; --i3) {
      if (path6.charCodeAt(i3) === CHAR_FORWARD_SLASH2) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i3 + 1;
      }
    }
    if (end === -1) return "";
    return path6.slice(start, end);
  }
}
function extname5(path6) {
  assertPath2(path6);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i3 = path6.length - 1; i3 >= 0; --i3) {
    const code = path6.charCodeAt(i3);
    if (code === CHAR_FORWARD_SLASH2) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path6.slice(startDot, end);
}
function format5(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format2("/", pathObject);
}
function parse5(path6) {
  assertPath2(path6);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path6.length === 0) return ret;
  const isAbsolute7 = path6.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  let start;
  if (isAbsolute7) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i3 = path6.length - 1;
  let preDotState = 0;
  for (; i3 >= start; --i3) {
    const code = path6.charCodeAt(i3);
    if (code === CHAR_FORWARD_SLASH2) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute7) {
        ret.base = ret.name = path6.slice(1, end);
      } else {
        ret.base = ret.name = path6.slice(startPart, end);
      }
    }
  } else {
    if (startPart === 0 && isAbsolute7) {
      ret.name = path6.slice(1, startDot);
      ret.base = path6.slice(1, end);
    } else {
      ret.name = path6.slice(startPart, startDot);
      ret.base = path6.slice(startPart, end);
    }
    ret.ext = path6.slice(startDot, end);
  }
  if (startPart > 0) ret.dir = path6.slice(0, startPart - 1);
  else if (isAbsolute7) ret.dir = "/";
  return ret;
}
function fromFileUrl5(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function toFileUrl5(path6) {
  if (!isAbsolute5(path6)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace2(
    path6.replace(/%/g, "%25").replace(/\\/g, "%5C")
  );
  return url;
}

// https://deno.land/std@0.133.0/path/glob.ts
var path3 = isWindows2 ? win32_exports2 : posix_exports2;
var { join: join7, normalize: normalize7 } = path3;

// https://deno.land/std@0.133.0/path/mod.ts
var path4 = isWindows2 ? win32_exports2 : posix_exports2;
var {
  basename: basename6,
  delimiter: delimiter6,
  dirname: dirname6,
  extname: extname6,
  format: format6,
  fromFileUrl: fromFileUrl6,
  isAbsolute: isAbsolute6,
  join: join8,
  normalize: normalize8,
  parse: parse6,
  relative: relative6,
  resolve: resolve6,
  sep: sep6,
  toFileUrl: toFileUrl6,
  toNamespacedPath: toNamespacedPath6
} = path4;

// https://deno.land/std@0.133.0/fs/_util.ts
function isSubdir(src, dest, sep7 = sep6) {
  if (src === dest) {
    return false;
  }
  const srcArray = src.split(sep7);
  const destArray = dest.split(sep7);
  return srcArray.every((current, i3) => destArray[i3] === current);
}
function getFileInfoType(fileInfo) {
  return fileInfo.isFile ? "file" : fileInfo.isDirectory ? "dir" : fileInfo.isSymlink ? "symlink" : void 0;
}

// https://deno.land/std@0.133.0/fs/ensure_dir.ts
async function ensureDir(dir) {
  try {
    const fileInfo = await Deno.lstat(dir);
    if (!fileInfo.isDirectory) {
      throw new Error(
        `Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`
      );
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      await Deno.mkdir(dir, { recursive: true });
      return;
    }
    throw err;
  }
}
function ensureDirSync(dir) {
  try {
    const fileInfo = Deno.lstatSync(dir);
    if (!fileInfo.isDirectory) {
      throw new Error(
        `Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`
      );
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      Deno.mkdirSync(dir, { recursive: true });
      return;
    }
    throw err;
  }
}

// https://deno.land/std@0.133.0/fs/exists.ts
async function exists(filePath) {
  try {
    await Deno.lstat(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}
function existsSync(filePath) {
  try {
    Deno.lstatSync(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}

// https://deno.land/std@0.133.0/fs/move.ts
async function move(src, dest, { overwrite = false } = {}) {
  const srcStat = await Deno.stat(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(
      `Cannot move '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  if (overwrite) {
    if (await exists(dest)) {
      await Deno.remove(dest, { recursive: true });
    }
  } else {
    if (await exists(dest)) {
      throw new Error("dest already exists.");
    }
  }
  await Deno.rename(src, dest);
  return;
}
function moveSync(src, dest, { overwrite = false } = {}) {
  const srcStat = Deno.statSync(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(
      `Cannot move '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  if (overwrite) {
    if (existsSync(dest)) {
      Deno.removeSync(dest, { recursive: true });
    }
  } else {
    if (existsSync(dest)) {
      throw new Error("dest already exists.");
    }
  }
  Deno.renameSync(src, dest);
}

// https://deno.land/std@0.133.0/_deno_unstable.ts
function utime(...args2) {
  if (typeof Deno.utime == "function") {
    return Deno.utime(...args2);
  } else {
    return Promise.reject(new TypeError("Requires --unstable"));
  }
}
function utimeSync(...args2) {
  if (typeof Deno.utimeSync == "function") {
    return Deno.utimeSync(...args2);
  } else {
    throw new TypeError("Requires --unstable");
  }
}

// https://deno.land/std@0.133.0/fs/copy.ts
async function ensureValidCopy(src, dest, options) {
  let destStat;
  try {
    destStat = await Deno.lstat(dest);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return;
    }
    throw err;
  }
  if (options.isFolder && !destStat.isDirectory) {
    throw new Error(
      `Cannot overwrite non-directory '${dest}' with directory '${src}'.`
    );
  }
  if (!options.overwrite) {
    throw new Error(`'${dest}' already exists.`);
  }
  return destStat;
}
function ensureValidCopySync(src, dest, options) {
  let destStat;
  try {
    destStat = Deno.lstatSync(dest);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return;
    }
    throw err;
  }
  if (options.isFolder && !destStat.isDirectory) {
    throw new Error(
      `Cannot overwrite non-directory '${dest}' with directory '${src}'.`
    );
  }
  if (!options.overwrite) {
    throw new Error(`'${dest}' already exists.`);
  }
  return destStat;
}
async function copyFile(src, dest, options) {
  await ensureValidCopy(src, dest, options);
  await Deno.copyFile(src, dest);
  if (options.preserveTimestamps) {
    const statInfo = await Deno.stat(src);
    assert3(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert3(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    await utime(dest, statInfo.atime, statInfo.mtime);
  }
}
function copyFileSync(src, dest, options) {
  ensureValidCopySync(src, dest, options);
  Deno.copyFileSync(src, dest);
  if (options.preserveTimestamps) {
    const statInfo = Deno.statSync(src);
    assert3(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert3(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    utimeSync(dest, statInfo.atime, statInfo.mtime);
  }
}
async function copySymLink(src, dest, options) {
  await ensureValidCopy(src, dest, options);
  const originSrcFilePath = await Deno.readLink(src);
  const type = getFileInfoType(await Deno.lstat(src));
  if (isWindows2) {
    await Deno.symlink(originSrcFilePath, dest, {
      type: type === "dir" ? "dir" : "file"
    });
  } else {
    await Deno.symlink(originSrcFilePath, dest);
  }
  if (options.preserveTimestamps) {
    const statInfo = await Deno.lstat(src);
    assert3(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert3(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    await utime(dest, statInfo.atime, statInfo.mtime);
  }
}
function copySymlinkSync(src, dest, options) {
  ensureValidCopySync(src, dest, options);
  const originSrcFilePath = Deno.readLinkSync(src);
  const type = getFileInfoType(Deno.lstatSync(src));
  if (isWindows2) {
    Deno.symlinkSync(originSrcFilePath, dest, {
      type: type === "dir" ? "dir" : "file"
    });
  } else {
    Deno.symlinkSync(originSrcFilePath, dest);
  }
  if (options.preserveTimestamps) {
    const statInfo = Deno.lstatSync(src);
    assert3(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert3(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    utimeSync(dest, statInfo.atime, statInfo.mtime);
  }
}
async function copyDir(src, dest, options) {
  const destStat = await ensureValidCopy(src, dest, {
    ...options,
    isFolder: true
  });
  if (!destStat) {
    await ensureDir(dest);
  }
  if (options.preserveTimestamps) {
    const srcStatInfo = await Deno.stat(src);
    assert3(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert3(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    await utime(dest, srcStatInfo.atime, srcStatInfo.mtime);
  }
  for await (const entry of Deno.readDir(src)) {
    const srcPath = join8(src, entry.name);
    const destPath = join8(dest, basename6(srcPath));
    if (entry.isSymlink) {
      await copySymLink(srcPath, destPath, options);
    } else if (entry.isDirectory) {
      await copyDir(srcPath, destPath, options);
    } else if (entry.isFile) {
      await copyFile(srcPath, destPath, options);
    }
  }
}
function copyDirSync(src, dest, options) {
  const destStat = ensureValidCopySync(src, dest, {
    ...options,
    isFolder: true
  });
  if (!destStat) {
    ensureDirSync(dest);
  }
  if (options.preserveTimestamps) {
    const srcStatInfo = Deno.statSync(src);
    assert3(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert3(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    utimeSync(dest, srcStatInfo.atime, srcStatInfo.mtime);
  }
  for (const entry of Deno.readDirSync(src)) {
    assert3(entry.name != null, "file.name must be set");
    const srcPath = join8(src, entry.name);
    const destPath = join8(dest, basename6(srcPath));
    if (entry.isSymlink) {
      copySymlinkSync(srcPath, destPath, options);
    } else if (entry.isDirectory) {
      copyDirSync(srcPath, destPath, options);
    } else if (entry.isFile) {
      copyFileSync(srcPath, destPath, options);
    }
  }
}
async function copy2(src, dest, options = {}) {
  src = resolve6(src);
  dest = resolve6(dest);
  if (src === dest) {
    throw new Error("Source and destination cannot be the same.");
  }
  const srcStat = await Deno.lstat(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(
      `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  if (srcStat.isSymlink) {
    await copySymLink(src, dest, options);
  } else if (srcStat.isDirectory) {
    await copyDir(src, dest, options);
  } else if (srcStat.isFile) {
    await copyFile(src, dest, options);
  }
}
function copySync(src, dest, options = {}) {
  src = resolve6(src);
  dest = resolve6(dest);
  if (src === dest) {
    throw new Error("Source and destination cannot be the same.");
  }
  const srcStat = Deno.lstatSync(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(
      `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  if (srcStat.isSymlink) {
    copySymlinkSync(src, dest, options);
  } else if (srcStat.isDirectory) {
    copyDirSync(src, dest, options);
  } else if (srcStat.isFile) {
    copyFileSync(src, dest, options);
  }
}

// https://deno.land/std@0.214.0/path/_os.ts
var osType3 = (() => {
  const { Deno: Deno4 } = globalThis;
  if (typeof Deno4?.build?.os === "string") {
    return Deno4.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win")) {
    return "windows";
  }
  return "linux";
})();
var isWindows3 = osType3 === "windows";

// https://deno.land/std@0.214.0/path/_common/glob_to_reg_exp.ts
var regExpEscapeChars = [
  "!",
  "$",
  "(",
  ")",
  "*",
  "+",
  ".",
  "=",
  "?",
  "[",
  "\\",
  "^",
  "{",
  "|"
];
var rangeEscapeChars = ["-", "\\", "]"];
function _globToRegExp(c2, glob2, {
  extended = true,
  globstar: globstarOption = true,
  // os = osType,
  caseInsensitive = false
} = {}) {
  if (glob2 === "") {
    return /(?!)/;
  }
  let newLength = glob2.length;
  for (; newLength > 1 && c2.seps.includes(glob2[newLength - 1]); newLength--) ;
  glob2 = glob2.slice(0, newLength);
  let regExpString = "";
  for (let j3 = 0; j3 < glob2.length; ) {
    let segment = "";
    const groupStack = [];
    let inRange = false;
    let inEscape = false;
    let endsWithSep = false;
    let i3 = j3;
    for (; i3 < glob2.length && !c2.seps.includes(glob2[i3]); i3++) {
      if (inEscape) {
        inEscape = false;
        const escapeChars = inRange ? rangeEscapeChars : regExpEscapeChars;
        segment += escapeChars.includes(glob2[i3]) ? `\\${glob2[i3]}` : glob2[i3];
        continue;
      }
      if (glob2[i3] === c2.escapePrefix) {
        inEscape = true;
        continue;
      }
      if (glob2[i3] === "[") {
        if (!inRange) {
          inRange = true;
          segment += "[";
          if (glob2[i3 + 1] === "!") {
            i3++;
            segment += "^";
          } else if (glob2[i3 + 1] === "^") {
            i3++;
            segment += "\\^";
          }
          continue;
        } else if (glob2[i3 + 1] === ":") {
          let k4 = i3 + 1;
          let value = "";
          while (glob2[k4 + 1] !== void 0 && glob2[k4 + 1] !== ":") {
            value += glob2[k4 + 1];
            k4++;
          }
          if (glob2[k4 + 1] === ":" && glob2[k4 + 2] === "]") {
            i3 = k4 + 2;
            if (value === "alnum") segment += "\\dA-Za-z";
            else if (value === "alpha") segment += "A-Za-z";
            else if (value === "ascii") segment += "\0-";
            else if (value === "blank") segment += "	 ";
            else if (value === "cntrl") segment += "\0-";
            else if (value === "digit") segment += "\\d";
            else if (value === "graph") segment += "!-~";
            else if (value === "lower") segment += "a-z";
            else if (value === "print") segment += " -~";
            else if (value === "punct") {
              segment += `!"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_‘{|}~`;
            } else if (value === "space") segment += "\\s\v";
            else if (value === "upper") segment += "A-Z";
            else if (value === "word") segment += "\\w";
            else if (value === "xdigit") segment += "\\dA-Fa-f";
            continue;
          }
        }
      }
      if (glob2[i3] === "]" && inRange) {
        inRange = false;
        segment += "]";
        continue;
      }
      if (inRange) {
        if (glob2[i3] === "\\") {
          segment += `\\\\`;
        } else {
          segment += glob2[i3];
        }
        continue;
      }
      if (glob2[i3] === ")" && groupStack.length > 0 && groupStack[groupStack.length - 1] !== "BRACE") {
        segment += ")";
        const type = groupStack.pop();
        if (type === "!") {
          segment += c2.wildcard;
        } else if (type !== "@") {
          segment += type;
        }
        continue;
      }
      if (glob2[i3] === "|" && groupStack.length > 0 && groupStack[groupStack.length - 1] !== "BRACE") {
        segment += "|";
        continue;
      }
      if (glob2[i3] === "+" && extended && glob2[i3 + 1] === "(") {
        i3++;
        groupStack.push("+");
        segment += "(?:";
        continue;
      }
      if (glob2[i3] === "@" && extended && glob2[i3 + 1] === "(") {
        i3++;
        groupStack.push("@");
        segment += "(?:";
        continue;
      }
      if (glob2[i3] === "?") {
        if (extended && glob2[i3 + 1] === "(") {
          i3++;
          groupStack.push("?");
          segment += "(?:";
        } else {
          segment += ".";
        }
        continue;
      }
      if (glob2[i3] === "!" && extended && glob2[i3 + 1] === "(") {
        i3++;
        groupStack.push("!");
        segment += "(?!";
        continue;
      }
      if (glob2[i3] === "{") {
        groupStack.push("BRACE");
        segment += "(?:";
        continue;
      }
      if (glob2[i3] === "}" && groupStack[groupStack.length - 1] === "BRACE") {
        groupStack.pop();
        segment += ")";
        continue;
      }
      if (glob2[i3] === "," && groupStack[groupStack.length - 1] === "BRACE") {
        segment += "|";
        continue;
      }
      if (glob2[i3] === "*") {
        if (extended && glob2[i3 + 1] === "(") {
          i3++;
          groupStack.push("*");
          segment += "(?:";
        } else {
          const prevChar = glob2[i3 - 1];
          let numStars = 1;
          while (glob2[i3 + 1] === "*") {
            i3++;
            numStars++;
          }
          const nextChar = glob2[i3 + 1];
          if (globstarOption && numStars === 2 && [...c2.seps, void 0].includes(prevChar) && [...c2.seps, void 0].includes(nextChar)) {
            segment += c2.globstar;
            endsWithSep = true;
          } else {
            segment += c2.wildcard;
          }
        }
        continue;
      }
      segment += regExpEscapeChars.includes(glob2[i3]) ? `\\${glob2[i3]}` : glob2[i3];
    }
    if (groupStack.length > 0 || inRange || inEscape) {
      segment = "";
      for (const c3 of glob2.slice(j3, i3)) {
        segment += regExpEscapeChars.includes(c3) ? `\\${c3}` : c3;
        endsWithSep = false;
      }
    }
    regExpString += segment;
    if (!endsWithSep) {
      regExpString += i3 < glob2.length ? c2.sep : c2.sepMaybe;
      endsWithSep = true;
    }
    while (c2.seps.includes(glob2[i3])) i3++;
    if (!(i3 > j3)) {
      throw new Error("Assertion failure: i > j (potential infinite loop)");
    }
    j3 = i3;
  }
  regExpString = `^${regExpString}$`;
  return new RegExp(regExpString, caseInsensitive ? "i" : "");
}

// https://deno.land/std@0.214.0/path/posix/glob_to_regexp.ts
var constants = {
  sep: "/+",
  sepMaybe: "/*",
  seps: ["/"],
  globstar: "(?:[^/]*(?:/|$)+)*",
  wildcard: "[^/]*",
  escapePrefix: "\\"
};
function globToRegExp2(glob2, options = {}) {
  return _globToRegExp(constants, glob2, options);
}

// https://deno.land/std@0.214.0/path/windows/glob_to_regexp.ts
var constants2 = {
  sep: "(?:\\\\|/)+",
  sepMaybe: "(?:\\\\|/)*",
  seps: ["\\", "/"],
  globstar: "(?:[^\\\\/]*(?:\\\\|/|$)+)*",
  wildcard: "[^\\\\/]*",
  escapePrefix: "`"
};
function globToRegExp3(glob2, options = {}) {
  return _globToRegExp(constants2, glob2, options);
}

// https://deno.land/std@0.214.0/path/glob_to_regexp.ts
function globToRegExp4(glob2, options = {}) {
  return options.os === "windows" || !options.os && isWindows3 ? globToRegExp3(glob2, options) : globToRegExp2(glob2, options);
}

// https://esm.sh/gh/jeff-hykin/good-js@f6d5bcb/denonext/source/flattened/is_generator_object.mjs
var o = function(t) {
  return typeof t?.next == "function";
};
var r = function(t) {
  return t != null && (typeof t[Symbol.iterator] == "function" || typeof t[Symbol.asyncIterator] == "function");
};
var f = (t) => o(t) && r(t);

// https://esm.sh/gh/jeff-hykin/good-js@f6d5bcb/denonext/source/flattened/typed_array_classes.mjs
var r2 = [Uint16Array, Uint32Array, Uint8Array, Uint8ClampedArray, Int16Array, Int32Array, Int8Array, Float32Array, Float64Array];
globalThis.BigInt64Array && r2.push(globalThis.BigInt64Array);
globalThis.BigUint64Array && r2.push(globalThis.BigUint64Array);

// https://esm.sh/gh/jeff-hykin/good-js@f6d5bcb/denonext/source/flattened/path_pure_name.mjs
var c = 47;
function a(e) {
  if (typeof e != "string") throw new TypeError(`Path must be a string. Received ${JSON.stringify(e)}`);
}
function u(e, t = "") {
  if (t !== void 0 && typeof t != "string") throw new TypeError('"ext" argument must be a string');
  a(e);
  let i3 = 0, r4 = -1, l = true, n;
  if (t !== void 0 && t.length > 0 && t.length <= e.length) {
    if (t.length === e.length && t === e) return "";
    let f3 = t.length - 1, o2 = -1;
    for (n = e.length - 1; n >= 0; --n) {
      let s2 = e.charCodeAt(n);
      if (s2 === c) {
        if (!l) {
          i3 = n + 1;
          break;
        }
      } else o2 === -1 && (l = false, o2 = n + 1), f3 >= 0 && (s2 === t.charCodeAt(f3) ? --f3 === -1 && (r4 = n) : (f3 = -1, r4 = o2));
    }
    return i3 === r4 ? r4 = o2 : r4 === -1 && (r4 = e.length), e.slice(i3, r4);
  } else {
    for (n = e.length - 1; n >= 0; --n) if (e.charCodeAt(n) === c) {
      if (!l) {
        i3 = n + 1;
        break;
      }
    } else r4 === -1 && (l = false, r4 = n + 1);
    return r4 === -1 ? "" : e.slice(i3, r4);
  }
}
var d = { basename: u };
function A2(e) {
  let t = d.basename(e?.path || e).split(".");
  return t.length == 1 ? t[0] : t.slice(0, -1);
}

// https://deno.land/x/quickr@0.8.4/main/flat/_path_standardize.js
var pathStandardize = (path6) => {
  if (path6 instanceof Array) {
    return path6.map(pathStandardize);
  }
  path6 = path6.path || path6;
  if (typeof path6 == "string" && path6.startsWith("file:///")) {
    path6 = fromFileUrl3(path6);
  }
  return path6;
};

// https://deno.land/x/deno_deno@1.42.1.7/main.js
var fakeEnv = {
  HOME: "/fake/home",
  SHELL: "sh",
  PWD: "./"
};
var NotFound = class extends Error {
};
var PermissionDenied = class extends Error {
};
var ConnectionRefused = class extends Error {
};
var ConnectionReset = class extends Error {
};
var ConnectionAborted = class extends Error {
};
var NotConnected = class extends Error {
};
var AddrInUse = class extends Error {
};
var AddrNotAvailable = class extends Error {
};
var BrokenPipe = class extends Error {
};
var AlreadyExists = class extends Error {
};
var InvalidData = class extends Error {
};
var TimedOut = class extends Error {
};
var Interrupted = class extends Error {
};
var WriteZero = class extends Error {
};
var WouldBlock = class extends Error {
};
var UnexpectedEof = class extends Error {
};
var BadResource = class extends Error {
};
var Http = class extends Error {
};
var Busy = class extends Error {
};
var NotSupported = class extends Error {
};
var FilesystemLoop = class extends Error {
};
var IsADirectory = class extends Error {
};
var NetworkUnreachable = class extends Error {
};
var NotADirectory = class extends Error {
};
var PermissionStatus = class {
  constructor(state) {
  }
};
var Permissions = class {
  async query() {
    return Promise.resolve(new PermissionStatus("granted"));
  }
  async revoke() {
    return Promise.resolve(new PermissionStatus("granted"));
  }
  async request() {
    return Promise.resolve(new PermissionStatus("granted"));
  }
};
var Stdin = class {
  static rid = 0;
  constructor() {
    this._inputs = [];
    this.isClosed = false;
  }
  isTerminal() {
    return false;
  }
  read(v4) {
    return Promise.resolve(new Uint8Array());
  }
  readSync(v4) {
  }
  setRaw(v4) {
    this._inputs.push(v4);
  }
  close() {
    this.isClosed = true;
  }
  readable() {
    if (globalThis.ReadableStream && !this.isClosed) {
      return new ReadableStream();
    }
  }
};
var Stdout = class {
  static rid = 1;
  constructor() {
    this._inputs = [];
  }
  write(v4) {
    this._inputs.push(v4);
    return Promise.resolve(v4.length);
  }
  writeSync(v4) {
    this._inputs.push(v4);
    return v4.length;
  }
  close() {
    this.isClosed = true;
  }
  writable() {
    if (globalThis.WritableStream && !this.isClosed) {
      return new WritableStream();
    }
  }
};
var Stderr = class {
  static rid = 2;
  constructor() {
    this._inputs = [];
  }
  write(v4) {
    this._inputs.push(v4);
    return Promise.resolve(v4.length);
  }
  writeSync(v4) {
    this._inputs.push(v4);
    return v4.length;
  }
  close() {
    this.isClosed = true;
  }
  writable() {
    if (globalThis.WritableStream && !this.isClosed) {
      return new WritableStream();
    }
  }
};
var Deno2 = globalThis.Deno ? globalThis.Deno : {
  mainModule: "file:///fake/$deno$repl.ts",
  internal: Symbol("Deno.internal"),
  version: { deno: "1.42.1", v8: "12.3.219.9", typescript: "5.4.3" },
  noColor: true,
  args: [],
  build: {
    target: "aarch64-apple-darwin",
    arch: "aarch64",
    os: "darwin",
    vendor: "apple",
    env: void 0
    // <- thats actually natively true
  },
  pid: 3,
  ppid: 2,
  env: {
    get(_3) {
      return fakeEnv[_3];
    },
    set(_3, __) {
      fakeEnv[_3] = __;
    }
  },
  errors: {
    NotFound,
    PermissionDenied,
    ConnectionRefused,
    ConnectionReset,
    ConnectionAborted,
    NotConnected,
    AddrInUse,
    AddrNotAvailable,
    BrokenPipe,
    AlreadyExists,
    InvalidData,
    TimedOut,
    Interrupted,
    WriteZero,
    WouldBlock,
    UnexpectedEof,
    BadResource,
    Http,
    Busy,
    NotSupported,
    FilesystemLoop,
    IsADirectory,
    NetworkUnreachable,
    NotADirectory
  },
  SeekMode: {
    0: "Start",
    1: "Current",
    2: "End",
    Start: 0,
    Current: 1,
    End: 2
  },
  stdin: new Stdin(),
  stdout: new Stdout(),
  stderr: new Stderr(),
  permissions: new Permissions(),
  resources() {
  },
  close() {
  },
  metrics() {
  },
  Process() {
  },
  run() {
  },
  isatty() {
  },
  writeFileSync() {
  },
  writeFile() {
  },
  writeTextFileSync() {
  },
  writeTextFile() {
  },
  readTextFile() {
  },
  readTextFileSync() {
  },
  readFile() {
  },
  readFileSync() {
  },
  watchFs() {
  },
  chmodSync() {
  },
  chmod() {
  },
  chown() {
  },
  chownSync() {
  },
  copyFileSync() {
  },
  cwd() {
    return fakeEnv["PWD"];
  },
  makeTempDirSync() {
  },
  makeTempDir() {
  },
  makeTempFileSync() {
  },
  makeTempFile() {
  },
  memoryUsage() {
  },
  mkdirSync() {
  },
  mkdir() {
  },
  chdir() {
  },
  copyFile() {
  },
  readDirSync() {
  },
  readDir() {
  },
  readLinkSync() {
  },
  readLink() {
  },
  realPathSync() {
  },
  realPath() {
  },
  removeSync() {
  },
  remove() {
  },
  renameSync() {
  },
  rename() {
  },
  statSync() {
  },
  lstatSync() {
  },
  stat() {
  },
  lstat() {
  },
  truncateSync() {
  },
  truncate() {
  },
  ftruncateSync() {
  },
  ftruncate() {
  },
  futime() {
  },
  futimeSync() {
  },
  inspect() {
  },
  exit() {
    throw Error(`Deno.exit() is not supported, so I'll just throw an error`);
  },
  execPath() {
  },
  Buffer() {
  },
  readAll() {
  },
  readAllSync() {
  },
  writeAll() {
  },
  writeAllSync() {
  },
  copy() {
  },
  iter() {
  },
  iterSync() {
  },
  read() {
  },
  readSync() {
  },
  write() {
  },
  writeSync() {
  },
  File() {
  },
  FsFile() {
  },
  open() {
  },
  openSync() {
  },
  create() {
  },
  createSync() {
  },
  seek() {
  },
  seekSync() {
  },
  connect() {
  },
  listen() {
  },
  loadavg() {
  },
  connectTls() {
  },
  listenTls() {
  },
  startTls() {
  },
  shutdown() {
  },
  fstatSync() {
  },
  fstat() {
  },
  fsyncSync() {
  },
  fsync() {
  },
  fdatasyncSync() {
  },
  fdatasync() {
  },
  symlink() {
  },
  symlinkSync() {
  },
  link() {
  },
  linkSync() {
  },
  Permissions() {
  },
  PermissionStatus() {
  },
  serveHttp() {
  },
  serve() {
  },
  resolveDns() {
  },
  upgradeWebSocket() {
  },
  utime() {
  },
  utimeSync() {
  },
  kill() {
  },
  addSignalListener() {
  },
  removeSignalListener() {
  },
  refTimer() {
  },
  unrefTimer() {
  },
  osRelease() {
    return "fake";
  },
  osUptime() {
  },
  hostname() {
    return "fake";
  },
  systemMemoryInfo() {
    return {
      total: 17179869184,
      free: 77104,
      available: 3279456,
      buffers: 0,
      cached: 0,
      swapTotal: 18253611008,
      swapFree: 878313472
    };
  },
  networkInterfaces() {
    return [];
  },
  consoleSize() {
    return { columns: 120, rows: 20 };
  },
  gid() {
    return 20;
  },
  uid() {
    return 501;
  },
  Command() {
  },
  ChildProcess() {
  },
  test() {
  },
  bench() {
  }
};
var internal = Deno2.internal;
var resources = Deno2.resources;
var close = Deno2.close;
var metrics = Deno2.metrics;
var Process = Deno2.Process;
var run = Deno2.run;
var isatty = Deno2.isatty;
var writeFileSync = Deno2.writeFileSync;
var writeFile = Deno2.writeFile;
var writeTextFileSync = Deno2.writeTextFileSync;
var writeTextFile = Deno2.writeTextFile;
var readTextFile = Deno2.readTextFile;
var readTextFileSync = Deno2.readTextFileSync;
var readFile = Deno2.readFile;
var readFileSync = Deno2.readFileSync;
var watchFs = Deno2.watchFs;
var chmodSync = Deno2.chmodSync;
var chmod = Deno2.chmod;
var chown = Deno2.chown;
var chownSync = Deno2.chownSync;
var copyFileSync2 = Deno2.copyFileSync;
var cwd = Deno2.cwd;
var makeTempDirSync = Deno2.makeTempDirSync;
var makeTempDir = Deno2.makeTempDir;
var makeTempFileSync = Deno2.makeTempFileSync;
var makeTempFile = Deno2.makeTempFile;
var memoryUsage = Deno2.memoryUsage;
var mkdirSync = Deno2.mkdirSync;
var mkdir = Deno2.mkdir;
var chdir = Deno2.chdir;
var copyFile2 = Deno2.copyFile;
var readDirSync = Deno2.readDirSync;
var readDir = Deno2.readDir;
var readLinkSync = Deno2.readLinkSync;
var readLink = Deno2.readLink;
var realPathSync = Deno2.realPathSync;
var realPath = Deno2.realPath;
var removeSync = Deno2.removeSync;
var remove = Deno2.remove;
var renameSync = Deno2.renameSync;
var rename = Deno2.rename;
var version = Deno2.version;
var build = Deno2.build;
var statSync = Deno2.statSync;
var lstatSync = Deno2.lstatSync;
var stat = Deno2.stat;
var lstat = Deno2.lstat;
var truncateSync = Deno2.truncateSync;
var truncate = Deno2.truncate;
var ftruncateSync = Deno2.ftruncateSync;
var ftruncate = Deno2.ftruncate;
var futime = Deno2.futime;
var futimeSync = Deno2.futimeSync;
var errors = Deno2.errors;
var inspect = Deno2.inspect;
var env2 = Deno2.env;
var exit = Deno2.exit;
var execPath = Deno2.execPath;
var Buffer2 = Deno2.Buffer;
var readAll = Deno2.readAll;
var readAllSync = Deno2.readAllSync;
var writeAll = Deno2.writeAll;
var writeAllSync = Deno2.writeAllSync;
var copy3 = Deno2.copy;
var iter = Deno2.iter;
var iterSync = Deno2.iterSync;
var SeekMode = Deno2.SeekMode;
var read = Deno2.read;
var readSync = Deno2.readSync;
var write = Deno2.write;
var writeSync = Deno2.writeSync;
var File = Deno2.File;
var FsFile = Deno2.FsFile;
var open = Deno2.open;
var openSync = Deno2.openSync;
var create = Deno2.create;
var createSync = Deno2.createSync;
var stdin = Deno2.stdin;
var stdout = Deno2.stdout;
var stderr = Deno2.stderr;
var seek = Deno2.seek;
var seekSync = Deno2.seekSync;
var connect = Deno2.connect;
var listen = Deno2.listen;
var loadavg = Deno2.loadavg;
var connectTls = Deno2.connectTls;
var listenTls = Deno2.listenTls;
var startTls = Deno2.startTls;
var shutdown = Deno2.shutdown;
var fstatSync = Deno2.fstatSync;
var fstat = Deno2.fstat;
var fsyncSync = Deno2.fsyncSync;
var fsync = Deno2.fsync;
var fdatasyncSync = Deno2.fdatasyncSync;
var fdatasync = Deno2.fdatasync;
var symlink = Deno2.symlink;
var symlinkSync = Deno2.symlinkSync;
var link = Deno2.link;
var linkSync = Deno2.linkSync;
var permissions = Deno2.permissions;
var serveHttp = Deno2.serveHttp;
var serve = Deno2.serve;
var resolveDns = Deno2.resolveDns;
var upgradeWebSocket = Deno2.upgradeWebSocket;
var utime2 = Deno2.utime;
var utimeSync2 = Deno2.utimeSync;
var kill = Deno2.kill;
var addSignalListener = Deno2.addSignalListener;
var removeSignalListener = Deno2.removeSignalListener;
var refTimer = Deno2.refTimer;
var unrefTimer = Deno2.unrefTimer;
var osRelease = Deno2.osRelease;
var osUptime = Deno2.osUptime;
var hostname = Deno2.hostname;
var systemMemoryInfo = Deno2.systemMemoryInfo;
var networkInterfaces = Deno2.networkInterfaces;
var consoleSize = Deno2.consoleSize;
var gid = Deno2.gid;
var uid = Deno2.uid;
var Command = Deno2.Command;
var ChildProcess = Deno2.ChildProcess;
var test = Deno2.test;
var bench = Deno2.bench;
var pid = Deno2.pid;
var ppid = Deno2.ppid;
var noColor = Deno2.noColor;
var args = Deno2.args;
var mainModule = Deno2.mainModule;
try {
  globalThis.Deno = Deno2;
} catch (error) {
}
var DenoPermissions = Deno2.Permissions;
var DenoPermissionStatus = Deno2.PermissionStatus;

// https://deno.land/x/quickr@0.8.4/main/flat/make_absolute_path.js
var makeAbsolutePath = (path6) => {
  if (!isAbsolute3(path6)) {
    return normalize4(join4(cwd(), path6));
  } else {
    return normalize4(path6);
  }
};

// https://deno.land/x/quickr@0.8.4/main/flat/normalize_path.js
var normalizePath = (path6) => normalize4(pathStandardize(path6)).replace(/\/$/, "");

// https://deno.land/x/quickr@0.8.4/main/flat/path.js
var Deno3 = { lstatSync, statSync, readLinkSync };
var PathTools = { parse: parse3, basename: basename3, dirname: dirname3, relative: relative3, isAbsolute: isAbsolute3 };
var Path = class {
  constructor({ path: path6, _lstatData, _statData }) {
    this.path = path6;
    this._lstat = _lstatData;
    this._data = _statData;
  }
  // 
  // core data sources
  // 
  refresh() {
    this._lstat = null;
    this._data = null;
  }
  get lstat() {
    if (!this._lstat) {
      try {
        this._lstat = Deno3.lstatSync(this.path);
      } catch (error) {
        this._lstat = { doesntExist: true };
      }
    }
    return this._lstat;
  }
  get stat() {
    if (!this._stat) {
      const lstat2 = this.lstat;
      if (!lstat2.isSymlink) {
        this._stat = {
          isBrokenLink: false,
          isLoopOfLinks: false
        };
      } else {
        try {
          this._stat = Deno3.statSync(this.path);
        } catch (error) {
          this._stat = {};
          if (error.message.match(/^Too many levels of symbolic links/)) {
            this._stat.isBrokenLink = true;
            this._stat.isLoopOfLinks = true;
          } else if (error.message.match(/^No such file or directory/)) {
            this._stat.isBrokenLink = true;
          } else {
            throw error;
          }
        }
      }
    }
    return this._stat;
  }
  // 
  // main attributes
  // 
  get exists() {
    const lstat2 = this.lstat;
    return !lstat2.doesntExist;
  }
  get name() {
    return PathTools.parse(this.path).name;
  }
  get extension() {
    return PathTools.parse(this.path).ext;
  }
  get basename() {
    return this.path && PathTools.basename(this.path);
  }
  get parentPath() {
    return this.path && PathTools.dirname(this.path);
  }
  relativePathFrom(parentPath) {
    return PathTools.relative(parentPath, this.path);
  }
  get link() {
    const lstat2 = this.lstat;
    if (lstat2.isSymlink) {
      return Deno3.readLinkSync(this.path);
    } else {
      return null;
    }
  }
  get isSymlink() {
    const lstat2 = this.lstat;
    return !!lstat2.isSymlink;
  }
  get isRelativeSymlink() {
    const lstat2 = this.lstat;
    const isNotSymlink = !lstat2.isSymlink;
    if (isNotSymlink) {
      return false;
    }
    const relativeOrAbsolutePath = Deno3.readLinkSync(this.path);
    return !PathTools.isAbsolute(relativeOrAbsolutePath);
  }
  get isAbsoluteSymlink() {
    const lstat2 = this.lstat;
    const isNotSymlink = !lstat2.isSymlink;
    if (isNotSymlink) {
      return false;
    }
    const relativeOrAbsolutePath = Deno3.readLinkSync(this.path);
    return PathTools.isAbsolute(relativeOrAbsolutePath);
  }
  get isBrokenLink() {
    const stat2 = this.stat;
    return !!stat2.isBrokenLink;
  }
  get isLoopOfLinks() {
    const stat2 = this.stat;
    return !!stat2.isLoopOfLinks;
  }
  get isFile() {
    const lstat2 = this.lstat;
    if (lstat2.doesntExist) {
      return false;
    }
    if (!lstat2.isSymlink) {
      return lstat2.isFile;
    } else {
      return !!this.stat.isFile;
    }
  }
  get isFolder() {
    const lstat2 = this.lstat;
    if (lstat2.doesntExist) {
      return false;
    }
    if (!lstat2.isSymlink) {
      return lstat2.isDirectory;
    } else {
      return !!this.stat.isDirectory;
    }
  }
  get sizeInBytes() {
    const lstat2 = this.lstat;
    return lstat2.size;
  }
  get permissions() {
    const { mode } = this.lstat;
    return {
      owner: {
        //          rwxrwxrwx
        canRead: !!(256 & mode),
        canWrite: !!(128 & mode),
        canExecute: !!(64 & mode)
      },
      group: {
        canRead: !!(32 & mode),
        canWrite: !!(16 & mode),
        canExecute: !!(8 & mode)
      },
      others: {
        canRead: !!(4 & mode),
        canWrite: !!(2 & mode),
        canExecute: !!(1 & mode)
      }
    };
  }
  // aliases
  get isDirectory() {
    return this.isFolder;
  }
  get dirname() {
    return this.parentPath;
  }
  toJSON() {
    return {
      exists: this.exists,
      name: this.name,
      extension: this.extension,
      basename: this.basename,
      parentPath: this.parentPath,
      isSymlink: this.isSymlink,
      isBrokenLink: this.isBrokenLink,
      isLoopOfLinks: this.isLoopOfLinks,
      isFile: this.isFile,
      isFolder: this.isFolder,
      sizeInBytes: this.sizeInBytes,
      permissions: this.permissions,
      isDirectory: this.isDirectory,
      dirname: this.dirname
    };
  }
};

// https://deno.land/x/quickr@0.8.4/main/flat/escape_glob_for_posix.js
var escapeGlobForPosix = (glob2) => {
  return glob2.replace(/[\[\\\*\{\?@\+\!]/g, `\\$&`);
};

// https://deno.land/x/quickr@0.8.4/main/flat/escape_glob_for_windows.js
var escapeGlobForWindows = (glob2) => {
  return glob2.replace(/[\[`\*\{\?@\+\!]/g, "`$&");
};

// https://deno.land/x/quickr@0.8.4/main/flat/escape_glob.js
var escapeGlob = build.os == "windows" ? escapeGlobForWindows : escapeGlobForPosix;

// https://esm.sh/gh/jeff-hykin/good-js@f6d5bcb/denonext/source/flattened/common_prefix.mjs
function i(e) {
  for (let l of e) {
    for (let o2 of e) {
      if (o2 !== l) return false;
      l = o2;
    }
    break;
  }
  return true;
}
function m2(e) {
  let l = Math.max(...e.map((a5) => a5.length));
  if (l === 0 || e.length == 0) return "";
  let o2 = 0, r4, t = 0;
  for (; o2 <= l; ) r4 = Math.floor((o2 + l) / 2), i(e.map((f3) => f3.slice(0, r4))) ? (t = r4, o2 = r4 + 1) : l = r4 - 1;
  return e[0].slice(0, t);
}

// https://esm.sh/gh/jeff-hykin/good-js@f6d5bcb/denonext/source/flattened/get_trace_paths.mjs
var s = "<unknown>";
function r3() {
  let t = new Error().stack;
  return typeof Deno < "u" ? g2(t).slice(1) : t.split(`
`).reduce((l, n) => {
    let o2 = i2(n) || p2(n) || h3(n) || x2(n) || N2(n);
    return o2 && l.push(o2), l;
  }, []).slice(1);
}
var u2 = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|rsc|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
var a2 = /\((\S*)(?::(\d+))(?::(\d+))\)/;
function i2(t) {
  let e = u2.exec(t);
  if (!e) return null;
  let l = e[2] && e[2].indexOf("native") === 0, n = e[2] && e[2].indexOf("eval") === 0, o2 = a2.exec(e[2]);
  return n && o2 != null && (e[2] = o2[1], e[3] = o2[2], e[4] = o2[3]), { path: l ? null : e[2], methodName: e[1] || s, lineNumber: e[3] ? +e[3] : null, column: e[4] ? +e[4] : null };
}
var m3 = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|rsc|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
function p2(t) {
  let e = m3.exec(t);
  return e ? { path: e[2], methodName: e[1] || s, lineNumber: +e[3], column: e[4] ? +e[4] : null } : null;
}
var d2 = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|rsc|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
var f2 = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
function h3(t) {
  let e = d2.exec(t);
  if (!e) return null;
  let l = e[3] && e[3].indexOf(" > eval") > -1, n = f2.exec(e[3]);
  return l && n != null && (e[3] = n[1], e[4] = n[2], e[5] = null), { path: e[3], methodName: e[1] || s, lineNumber: e[4] ? +e[4] : null, column: e[5] ? +e[5] : null };
}
var b3 = /^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;
function N2(t) {
  let e = b3.exec(t);
  return e ? { path: e[3], methodName: e[1] || s, lineNumber: +e[4], column: e[5] ? +e[5] : null } : null;
}
var v2 = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;
function x2(t) {
  let e = v2.exec(t);
  return e ? { path: e[2], methodName: e[1] || s, lineNumber: +e[3], column: e[4] ? +e[4] : null } : null;
}
function g2(t) {
  let e = [];
  for (let l of t.matchAll(/\n    at (?:([\w\W]+?)\s)??(\(<anonymous>:\d+:\d+\)|\(<anonymous>\)|<anonymous>:\d+:\d+|<anonymous>|(?:(file:\/|https?:|ftp:|blob:)\/\/([\w\W]+?):(\d+):(\d+)|\((file:\/|https?:|ftp:|blob:)\/\/([\w\W]+?):(\d+):(\d+)\)))(?=\n    at |$)/g)) {
    let n = l[2];
    n[0] === "(" && n[n.length - 1] === ")" && (n = n.slice(1, -1));
    let o2 = { path: n, methodName: l[1] || s, lineNumber: null, column: null }, c2;
    (c2 = n.match(/:(\d+):(\d+)$/)) && (o2.path = n.slice(0, -c2[0].length), o2.lineNumber = c2[1] - 0, o2.column = c2[2] - 0), e.push(o2);
  }
  return e;
}
function R3() {
  return r3().slice(1).map((t) => t.path);
}

// https://esm.sh/gh/jeff-hykin/good-js@f6d5bcb/denonext/source/support/posix.mjs
var a3 = 47;
function d3(e) {
  if (typeof e != "string") throw new TypeError(`Path must be a string. Received ${JSON.stringify(e)}`);
}
function $(e) {
  if (d3(e), e.length === 0) return ".";
  let t = e.charCodeAt(0) === a3, i3 = -1, l = true;
  for (let n = e.length - 1; n >= 1; --n) if (e.charCodeAt(n) === a3) {
    if (!l) {
      i3 = n;
      break;
    }
  } else l = false;
  return i3 === -1 ? t ? "/" : "." : t && i3 === 1 ? "//" : e.slice(0, i3);
}

// https://esm.sh/gh/jeff-hykin/good-js@f6d5bcb/denonext/source/flattened/path_pieces.mjs
var D2 = 46;
var C2 = 47;
function m4(e) {
  if (typeof e != "string") throw new TypeError(`Path must be a string. Received ${JSON.stringify(e)}`);
}
function S3(e) {
  if (m4(e), e.length === 0) return ".";
  let r4 = e.charCodeAt(0) === C2, i3 = -1, t = true;
  for (let f3 = e.length - 1; f3 >= 1; --f3) if (e.charCodeAt(f3) === C2) {
    if (!t) {
      i3 = f3;
      break;
    }
  } else t = false;
  return i3 === -1 ? r4 ? "/" : "." : r4 && i3 === 1 ? "//" : e.slice(0, i3);
}
function E2(e, r4 = "") {
  if (r4 !== void 0 && typeof r4 != "string") throw new TypeError('"ext" argument must be a string');
  m4(e);
  let i3 = 0, t = -1, f3 = true, n;
  if (r4 !== void 0 && r4.length > 0 && r4.length <= e.length) {
    if (r4.length === e.length && r4 === e) return "";
    let o2 = r4.length - 1, l = -1;
    for (n = e.length - 1; n >= 0; --n) {
      let s2 = e.charCodeAt(n);
      if (s2 === C2) {
        if (!f3) {
          i3 = n + 1;
          break;
        }
      } else l === -1 && (f3 = false, l = n + 1), o2 >= 0 && (s2 === r4.charCodeAt(o2) ? --o2 === -1 && (t = n) : (o2 = -1, t = l));
    }
    return i3 === t ? t = l : t === -1 && (t = e.length), e.slice(i3, t);
  } else {
    for (n = e.length - 1; n >= 0; --n) if (e.charCodeAt(n) === C2) {
      if (!f3) {
        i3 = n + 1;
        break;
      }
    } else t === -1 && (f3 = false, t = n + 1);
    return t === -1 ? "" : e.slice(i3, t);
  }
}
function R4(e) {
  m4(e);
  let r4 = { root: "", dir: "", base: "", ext: "", name: "" };
  if (e.length === 0) return r4;
  let i3 = e.charCodeAt(0) === C2, t;
  i3 ? (r4.root = "/", t = 1) : t = 0;
  let f3 = -1, n = 0, o2 = -1, l = true, s2 = e.length - 1, d4 = 0;
  for (; s2 >= t; --s2) {
    let u3 = e.charCodeAt(s2);
    if (u3 === C2) {
      if (!l) {
        n = s2 + 1;
        break;
      }
      continue;
    }
    o2 === -1 && (l = false, o2 = s2 + 1), u3 === D2 ? f3 === -1 ? f3 = s2 : d4 !== 1 && (d4 = 1) : f3 !== -1 && (d4 = -1);
  }
  return f3 === -1 || o2 === -1 || d4 === 0 || d4 === 1 && f3 === o2 - 1 && f3 === n + 1 ? o2 !== -1 && (n === 0 && i3 ? r4.base = r4.name = e.slice(1, o2) : r4.base = r4.name = e.slice(n, o2)) : (n === 0 && i3 ? (r4.name = e.slice(1, f3), r4.base = e.slice(1, o2)) : (r4.name = e.slice(n, f3), r4.base = e.slice(n, o2)), r4.ext = e.slice(f3, o2)), n > 0 ? r4.dir = e.slice(0, n - 1) : i3 && (r4.dir = "/"), r4;
}
var h4 = { parse: R4, basename: E2, dirname: S3 };
function k3(e) {
  e = e.path || e;
  let r4 = h4.parse(e), i3 = [], t = r4.dir;
  for (; i3.push(h4.basename(t)), t != h4.dirname(t); ) t = h4.dirname(t);
  return i3.reverse(), i3[0] == "" && (i3[0] = "/"), [i3, r4.name, r4.ext];
}
var T3 = 65;
var _2 = 97;
var x3 = 90;
var U = 122;
var I = 46;
var H3 = 47;
var W3 = 92;
var b4 = 58;
function w2(e) {
  if (typeof e != "string") throw new TypeError(`Path must be a string. Received ${JSON.stringify(e)}`);
}
function N3(e) {
  return e === H3;
}
function a4(e) {
  return N3(e) || e === W3;
}
function v3(e) {
  return e >= _2 && e <= U || e >= T3 && e <= x3;
}
function $2(e) {
  w2(e);
  let r4 = e.length;
  if (r4 === 0) return ".";
  let i3 = -1, t = -1, f3 = true, n = 0, o2 = e.charCodeAt(0);
  if (r4 > 1) if (a4(o2)) {
    if (i3 = n = 1, a4(e.charCodeAt(1))) {
      let l = 2, s2 = l;
      for (; l < r4 && !a4(e.charCodeAt(l)); ++l) ;
      if (l < r4 && l !== s2) {
        for (s2 = l; l < r4 && a4(e.charCodeAt(l)); ++l) ;
        if (l < r4 && l !== s2) {
          for (s2 = l; l < r4 && !a4(e.charCodeAt(l)); ++l) ;
          if (l === r4) return e;
          l !== s2 && (i3 = n = l + 1);
        }
      }
    }
  } else v3(o2) && e.charCodeAt(1) === b4 && (i3 = n = 2, r4 > 2 && a4(e.charCodeAt(2)) && (i3 = n = 3));
  else if (a4(o2)) return e;
  for (let l = r4 - 1; l >= n; --l) if (a4(e.charCodeAt(l))) {
    if (!f3) {
      t = l;
      break;
    }
  } else f3 = false;
  if (t === -1) {
    if (i3 === -1) return ".";
    t = i3;
  }
  return e.slice(0, t);
}
function P3(e, r4 = "") {
  if (r4 !== void 0 && typeof r4 != "string") throw new TypeError('"ext" argument must be a string');
  w2(e);
  let i3 = 0, t = -1, f3 = true, n;
  if (e.length >= 2) {
    let o2 = e.charCodeAt(0);
    v3(o2) && e.charCodeAt(1) === b4 && (i3 = 2);
  }
  if (r4 !== void 0 && r4.length > 0 && r4.length <= e.length) {
    if (r4.length === e.length && r4 === e) return "";
    let o2 = r4.length - 1, l = -1;
    for (n = e.length - 1; n >= i3; --n) {
      let s2 = e.charCodeAt(n);
      if (a4(s2)) {
        if (!f3) {
          i3 = n + 1;
          break;
        }
      } else l === -1 && (f3 = false, l = n + 1), o2 >= 0 && (s2 === r4.charCodeAt(o2) ? --o2 === -1 && (t = n) : (o2 = -1, t = l));
    }
    return i3 === t ? t = l : t === -1 && (t = e.length), e.slice(i3, t);
  } else {
    for (n = e.length - 1; n >= i3; --n) if (a4(e.charCodeAt(n))) {
      if (!f3) {
        i3 = n + 1;
        break;
      }
    } else t === -1 && (f3 = false, t = n + 1);
    return t === -1 ? "" : e.slice(i3, t);
  }
}
function y(e) {
  w2(e);
  let r4 = { root: "", dir: "", base: "", ext: "", name: "" }, i3 = e.length;
  if (i3 === 0) return r4;
  let t = 0, f3 = e.charCodeAt(0);
  if (i3 > 1) {
    if (a4(f3)) {
      if (t = 1, a4(e.charCodeAt(1))) {
        let c2 = 2, A3 = c2;
        for (; c2 < i3 && !a4(e.charCodeAt(c2)); ++c2) ;
        if (c2 < i3 && c2 !== A3) {
          for (A3 = c2; c2 < i3 && a4(e.charCodeAt(c2)); ++c2) ;
          if (c2 < i3 && c2 !== A3) {
            for (A3 = c2; c2 < i3 && !a4(e.charCodeAt(c2)); ++c2) ;
            c2 === i3 ? t = c2 : c2 !== A3 && (t = c2 + 1);
          }
        }
      }
    } else if (v3(f3) && e.charCodeAt(1) === b4) if (t = 2, i3 > 2) {
      if (a4(e.charCodeAt(2))) {
        if (i3 === 3) return r4.root = r4.dir = e, r4;
        t = 3;
      }
    } else return r4.root = r4.dir = e, r4;
  } else if (a4(f3)) return r4.root = r4.dir = e, r4;
  t > 0 && (r4.root = e.slice(0, t));
  let n = -1, o2 = t, l = -1, s2 = true, d4 = e.length - 1, u3 = 0;
  for (; d4 >= t; --d4) {
    if (f3 = e.charCodeAt(d4), a4(f3)) {
      if (!s2) {
        o2 = d4 + 1;
        break;
      }
      continue;
    }
    l === -1 && (s2 = false, l = d4 + 1), f3 === I ? n === -1 ? n = d4 : u3 !== 1 && (u3 = 1) : n !== -1 && (u3 = -1);
  }
  return n === -1 || l === -1 || u3 === 0 || u3 === 1 && n === l - 1 && n === o2 + 1 ? l !== -1 && (r4.base = r4.name = e.slice(o2, l)) : (r4.name = e.slice(o2, n), r4.base = e.slice(o2, l), r4.ext = e.slice(n, l)), o2 > 0 && o2 !== t ? r4.dir = e.slice(0, o2 - 1) : r4.dir = r4.root, r4;
}
var g3 = { parse: y, basename: P3, dirname: $2 };
function L2(e) {
  e = e.path || e;
  let r4 = g3.parse(e), i3 = [], t = r4.dir;
  for (; i3.push(g3.basename(t)), t != g3.dirname(t); ) t = g3.dirname(t);
  return i3.reverse(), i3[0] == "" && (i3[0] = "C:\\"), [i3, r4.name, r4.ext];
}
function K(e, { fsType: r4 = "posix" } = {}) {
  if (r4 == "posix") return k3(e);
  if (r4 == "windows") return L2(e);
  throw Error(`Unsupported fsType: ${r4}, supported values are "posix" and "windows"`);
}

// https://deno.land/x/quickr@0.8.4/main/file_system.js
var cache2 = {};
function setTrueBit(n, bit) {
  return n | 1 << bit;
}
function setFalseBit(n, bit) {
  return ~(~n | 1 << bit);
}
var defaultOptionsHelper = (options) => ({
  renameExtension: options.renameExtension || FileSystem.defaultRenameExtension,
  overwrite: options.overwrite
});
var fileLockSymbol = Symbol.for("fileLock");
var locker = globalThis[fileLockSymbol] || {};
var grabPathLock = async (path6) => {
  while (locker[path6]) {
    await new Promise((resolve7) => setTimeout(resolve7, 70));
  }
  locker[path6] = true;
};
var logicalExtensionWrapper = (promise, path6) => {
  return promise;
};
var FileSystem = {
  defaultRenameExtension: ".old",
  denoExecutablePath: Deno.execPath(),
  parentPath: dirname3,
  dirname: dirname3,
  basename: basename3,
  extname: extname3,
  join: join4,
  normalize: normalizePath,
  normalizePath,
  pureNameOf: A2,
  isAbsolutePath: isAbsolute3,
  isRelativePath: (...args2) => !isAbsolute3(...args2),
  makeRelativePath: ({ from, to }) => relative3(from.path || from, to.path || to),
  makeAbsolutePath,
  pathDepth(path6) {
    path6 = FileSystem.normalizePath(path6);
    let count = 0;
    for (const eachChar of path6.path || path6) {
      if (eachChar == "/") {
        count++;
      }
    }
    if (path6[0] == "/") {
      count--;
    }
    return count + 1;
  },
  pathPieces: K,
  /**
   * add to name, preserve file extension
   *
   * @example
   * ```js
   * let newName = FileSystem.extendName({ path: "a/blah.thing.js", string: ".old" })
   * newName == "a/blah.old.thing.js"
   * ```
   *
   * @param arg1.path - item path
   * @param arg1.string - the string to append to the name
   * @return {string} - the new path
   */
  extendName({ path: path6, string }) {
    path6 = pathStandardize(path6);
    const [name, ...extensions] = basename3(path6).split(".");
    return `${dirname3(path6)}/${name}${string}${extensions.length == 0 ? "" : `.${extensions.join(".")}`}`;
  },
  /**
   * All Parent Paths
   *
   * @param {String} path - path doesnt need to exist
   * @return {[String]} longest to shortest parent path
   */
  allParentPaths(path6) {
    const pathStartsWithDotSlash = path6.startsWith("./");
    path6 = FileSystem.normalizePath(path6);
    if (path6 === ".") {
      return [];
    }
    const dotGotRemoved = pathStartsWithDotSlash && !path6.startsWith("./");
    let previousPath = null;
    let allPaths = [];
    while (1) {
      previousPath = path6;
      path6 = FileSystem.parentPath(path6);
      if (previousPath === path6) {
        break;
      }
      allPaths.push(path6);
    }
    allPaths.reverse();
    allPaths = allPaths.filter((each2) => each2 != ".");
    if (dotGotRemoved) {
      allPaths.push(".");
    }
    return allPaths;
  },
  pathOfCaller(callerNumber = void 0) {
    const err = new Error();
    let filePaths = Iu(/^.+file:\/\/(\/[\w\W]*?):/gm, err.stack).map((each2) => each2[1]);
    if (callerNumber) {
      filePaths = filePaths.slice(callerNumber);
    }
    try {
      const secondPath = filePaths[1];
      if (secondPath) {
        try {
          if (Deno.statSync(secondPath).isFile) {
            return secondPath;
          }
        } catch (error) {
        }
      }
    } catch (error) {
    }
    return Deno.cwd();
  },
  get home() {
    if (!cache2.home) {
      if (Deno.build.os != "windows") {
        cache2.home = Deno.env.get("HOME");
      } else {
        cache2.home = Deno.env.get("HOMEPATH");
      }
    }
    return cache2.home;
  },
  get workingDirectory() {
    return Deno.cwd();
  },
  set workingDirectory(value) {
    Deno.chdir(value);
  },
  get cwd() {
    return FileSystem.workingDirectory;
  },
  set cwd(value) {
    return FileSystem.workingDirectory = value;
  },
  get pwd() {
    return FileSystem.cwd;
  },
  set pwd(value) {
    return FileSystem.cwd = value;
  },
  cd(path6) {
    Deno.chdir(path6);
  },
  changeDirectory(path6) {
    Deno.chdir(path6);
  },
  get thisFile() {
    try {
      const paths = R3().slice(1);
      const urlLikes = paths.filter((each2) => each2.match(/^(file|ftp|ipfs|https?):\/\//));
      for (let each2 of urlLikes) {
        if (!each2.startsWith("file://")) {
          try {
            return new URL(each2).pathname;
          } catch (error) {
            return each2;
          }
        } else {
          each2 = each2.slice(7);
          const [folders, itemName, itemExtensionWithDot] = FileSystem.pathPieces(each2);
          const parentPath = join4(...folders);
          let name = itemName + itemExtensionWithDot;
          while (name.match(/#|\?/)) {
            const isDefinitelyExtra = name.match(/(#|\?)[^#\?]*$(?<!\.(js|ts|jsx|tsx|mjs|wasm|json|jsonc|cjs))/);
            if (!isDefinitelyExtra) {
              name = name.slice(0, isDefinitelyExtra.index);
              continue;
            }
            const actualPath2 = `${parentPath}/${name}`;
            try {
              if (Deno.statSync(actualPath2).isFile) {
                return actualPath2;
              }
            } catch (error) {
            }
            name = name.split(/(?=#|\?)/g).slice(0, -1).join("");
          }
          const actualPath = `${parentPath}/${name}`;
          try {
            if (Deno.statSync(actualPath).isFile) {
              return actualPath;
            }
          } catch (error) {
          }
        }
      }
      if (paths.length > 0) {
        return paths[0];
      }
      return "<unknown>";
    } catch (error) {
      return "<unknown>";
    }
  },
  get thisFolder() {
    try {
      const paths = R3().slice(1);
      const urlLikes = paths.filter((each2) => each2.match(/^(file|ftp|ipfs|https?):\/\//));
      for (let each2 of urlLikes) {
        if (!each2.startsWith("file://")) {
          try {
            return $(new URL(each2).pathname);
          } catch (error) {
            try {
              return $(each2);
            } catch (error2) {
              return each2;
            }
          }
        } else {
          each2 = each2.slice(7);
          const folderPath = dirname3(each2);
          try {
            if (Deno.statSync(folderPath).isDirectory) {
              return folderPath;
            }
          } catch (error) {
          }
        }
      }
      return Deno.cwd();
    } catch (error) {
      return Deno.cwd();
    }
  },
  async read(path6) {
    path6 = pathStandardize(path6);
    await grabPathLock(path6);
    let output2;
    try {
      output2 = await Deno.readTextFile(path6);
    } catch (error) {
    }
    delete locker[path6];
    return output2;
  },
  async readBytes(path6) {
    path6 = pathStandardize(path6);
    await grabPathLock(path6);
    let output2;
    try {
      output2 = await Deno.readFile(path6);
    } catch (error) {
    }
    delete locker[path6];
    return output2;
  },
  async *readLinesIteratively(path6) {
    path6 = pathStandardize(path6);
    await grabPathLock(path6);
    try {
      const file = await Deno.open(path6);
      try {
        yield* readLines(file);
      } finally {
        Deno?.close?.(file.rid);
      }
    } finally {
      delete locker[path6];
    }
  },
  async info(fileOrFolderPath, _cachedLstat = null) {
    fileOrFolderPath = pathStandardize(fileOrFolderPath);
    await grabPathLock(fileOrFolderPath);
    try {
      const lstat2 = _cachedLstat || await Deno.lstat(fileOrFolderPath).catch(() => ({ doesntExist: true }));
      let stat2 = {};
      if (!lstat2.isSymlink) {
        stat2 = {
          isBrokenLink: false,
          isLoopOfLinks: false
        };
      } else {
        try {
          stat2 = await Deno.stat(fileOrFolderPath);
        } catch (error) {
          if (error.message.match(/^Too many levels of symbolic links/)) {
            stat2.isBrokenLink = true;
            stat2.isLoopOfLinks = true;
          } else if (error.message.match(/^No such file or directory/)) {
            stat2.isBrokenLink = true;
          } else {
            if (!error.message.match(/^PermissionDenied:/)) {
              return { doesntExist: true, permissionDenied: true };
            }
            throw error;
          }
        }
      }
      return new Path({ path: fileOrFolderPath, _lstatData: lstat2, _statData: stat2 });
    } finally {
      delete locker[fileOrFolderPath];
    }
  },
  exists(path6) {
    return logicalExtensionWrapper(Deno.lstat(path6?.path || path6).catch(() => false), path6);
  },
  isSymlink(path6) {
    return logicalExtensionWrapper(Deno.lstat(path6?.path || path6).catch(() => false).then((item) => item.isSymlink), path6);
  },
  isFileOrSymlinkToNormalFile(path6) {
    return logicalExtensionWrapper(Deno.stat(path6?.path || path6).catch(() => false).then((item) => item.isFile), path6);
  },
  isFolderOrSymlinkToFolder(path6) {
    return logicalExtensionWrapper(Deno.stat(path6?.path || path6).catch(() => false).then((item) => item.isDirectory), path6);
  },
  isFileHardlink(path6) {
    return logicalExtensionWrapper(Deno.lstat(path6?.path || path6).catch(() => false).then((item) => item.isFile), path6);
  },
  isFolderHardlink(path6) {
    return logicalExtensionWrapper(Deno.lstat(path6?.path || path6).catch(() => false).then((item) => item.isDirectory), path6);
  },
  isNonFolderHardlink(path6) {
    return logicalExtensionWrapper(Deno.lstat(path6?.path || path6).catch(() => false).then((item) => !item.isDirectory), path6);
  },
  isWeirdItem(path6) {
    return logicalExtensionWrapper(Deno.lstat(path6?.path || path6).catch(() => false).then((item) => each.isBlockDevice || each.isCharDevice || each.isFifo || each.isSocket), path6);
  },
  async move({ path: path6, item, newParentFolder, newName, force = true, overwrite = false, renameExtension = null }) {
    item = item || path6;
    const oldPath = item.path || item;
    const oldName = FileSystem.basename(oldPath);
    const pathInfo = item instanceof Object || FileSystem.sync.info(oldPath);
    const newPath = `${newParentFolder || FileSystem.parentPath(oldPath)}/${newName || oldName}`;
    const cache3 = {};
    const oldHardPath = FileSystem.sync.makeHardPathTo(oldPath, { cache: cache3 });
    const newHardPath = FileSystem.sync.makeHardPathTo(newPath, { cache: cache3 });
    if (oldHardPath == newHardPath) {
      return;
    }
    if (pathInfo.isSymlink && !item.isBrokenLink) {
      const link2 = Deno.readLinkSync(pathInfo.path);
      if (!isAbsolute3(link2)) {
        const linkTargetBeforeMove = `${FileSystem.parentPath(pathInfo.path)}/${link2}`;
        await FileSystem.relativeLink({
          existingItem: linkTargetBeforeMove,
          newItem: newPath,
          force,
          overwrite,
          renameExtension
        });
        await FileSystem.remove(pathInfo);
      }
    }
    if (force) {
      FileSystem.sync.clearAPathFor(newPath, { overwrite, renameExtension });
    }
    await move(oldPath, newPath);
  },
  async rename({ from, to, force = true, overwrite = false, renameExtension = null }) {
    return FileSystem.move({ path: from, newParentFolder: FileSystem.parentPath(to), newName: FileSystem.basename(to), force, overwrite, renameExtension });
  },
  async remove(fileOrFolder) {
    fileOrFolder = pathStandardize(fileOrFolder);
    if (fileOrFolder instanceof Array) {
      return Promise.all(fileOrFolder.map(FileSystem.remove));
    }
    let exists2 = false;
    let item;
    try {
      item = await Deno.lstat(fileOrFolder);
      exists2 = true;
    } catch (error) {
    }
    if (exists2) {
      if (item.isFile || item.isSymlink || !item.isDirectory) {
        return Deno.remove(fileOrFolder.replace(/\/+$/, ""));
      } else {
        return Deno.remove(fileOrFolder.replace(/\/+$/, ""), { recursive: true });
      }
    }
  },
  async finalTargetOf(path6, options = {}) {
    const { _parentsHaveBeenChecked, cache: cache3 } = { _parentsHaveBeenChecked: false, cache: {}, ...options };
    const originalWasItem = path6 instanceof Path;
    path6 = path6.path || path6;
    let result = await Deno.lstat(path6).catch(() => ({ doesntExist: true }));
    if (result.doesntExist) {
      return null;
    }
    path6 = await FileSystem.makeHardPathTo(path6, { cache: cache3 });
    const pathChain = [];
    while (result.isSymlink) {
      const relativeOrAbsolutePath = await Deno.readLink(path6);
      if (isAbsolute3(relativeOrAbsolutePath)) {
        path6 = relativeOrAbsolutePath;
      } else {
        path6 = `${FileSystem.parentPath(path6)}/${relativeOrAbsolutePath}`;
      }
      result = await Deno.lstat(path6).catch(() => ({ doesntExist: true }));
      if (result.doesntExist) {
        return null;
      }
      path6 = await FileSystem.makeHardPathTo(path6, { cache: cache3 });
      if (pathChain.includes(path6)) {
        return null;
      }
      pathChain.push(path6);
    }
    path6 = FileSystem.normalizePath(path6);
    if (originalWasItem) {
      return new Path({ path: path6 });
    } else {
      return path6;
    }
  },
  async nextTargetOf(path6, options = {}) {
    const originalWasItem = path6 instanceof Path;
    const item = originalWasItem ? path6 : new Path({ path: path6 });
    const lstat2 = item.lstat;
    if (lstat2.isSymlink) {
      const relativeOrAbsolutePath = Deno.readLinkSync(item.path);
      if (isAbsolute3(relativeOrAbsolutePath)) {
        if (originalWasItem) {
          return new Path({ path: relativeOrAbsolutePath });
        } else {
          return relativeOrAbsolutePath;
        }
      } else {
        const path7 = `${await FileSystem.makeHardPathTo(dirname3(item.path))}/${relativeOrAbsolutePath}`;
        if (originalWasItem) {
          return new Path({ path: path7 });
        } else {
          return path7;
        }
      }
    } else {
      if (originalWasItem) {
        return item;
      } else {
        return item.path;
      }
    }
  },
  async ensureIsFile(path6, options = { overwrite: false, renameExtension: null }) {
    const { overwrite, renameExtension } = defaultOptionsHelper(options);
    await FileSystem.ensureIsFolder(FileSystem.parentPath(path6), { overwrite, renameExtension });
    path6 = path6.path || path6;
    const pathInfo = await FileSystem.info(path6);
    if (pathInfo.isFile && !pathInfo.isDirectory) {
      return path6;
    } else {
      await FileSystem.write({ path: path6, data: "" });
      return path6;
    }
  },
  async ensureIsFolder(path6, options = { overwrite: false, renameExtension: null }) {
    const { overwrite, renameExtension } = defaultOptionsHelper(options);
    path6 = path6.path || path6;
    path6 = FileSystem.makeAbsolutePath(path6);
    const parentPath = dirname3(path6);
    if (parentPath == path6) {
      return;
    }
    const parent = await FileSystem.info(parentPath);
    if (!parent.isDirectory) {
      FileSystem.sync.ensureIsFolder(parentPath, { overwrite, renameExtension });
    }
    let pathInfo = FileSystem.sync.info(path6);
    if (pathInfo.exists && !pathInfo.isDirectory) {
      if (overwrite) {
        await FileSystem.remove(path6);
      } else {
        await FileSystem.moveOutOfTheWay(eachPath, { extension: renameExtension });
      }
    }
    await Deno.mkdir(path6, { recursive: true });
    return path6;
  },
  /**
   * Move/Remove everything and Ensure parent folders
   *
   * @param path
   * @param options.overwrite - if false, then things in the way will be moved instead of deleted
   * @param options.renameExtension - the string to append when renaming files to get them out of the way
   * 
   * @note
   *     very agressive: will change whatever is necessary to make sure a parent exists
   * 
   * @example
   * ```js
   * await FileSystem.clearAPathFor("./something")
   * ```
   */
  async clearAPathFor(path6, options = { overwrite: false, renameExtension: null }) {
    const { overwrite, renameExtension } = defaultOptionsHelper(options);
    const originalPath = path6;
    const paths = [];
    while (dirname3(path6) !== path6) {
      paths.push(path6);
      path6 = dirname3(path6);
    }
    for (const eachPath2 of paths.reverse()) {
      const info = await FileSystem.info(eachPath2);
      if (!info.exists) {
        break;
      } else if (!info.isDirectory) {
        if (overwrite) {
          await FileSystem.remove(eachPath2);
        } else {
          await FileSystem.moveOutOfTheWay(eachPath2, { extension: renameExtension });
        }
      }
    }
    await Deno.mkdir(dirname3(originalPath), { recursive: true });
    return originalPath;
  },
  async moveOutOfTheWay(path6, options = { extension: null }) {
    const extension = options?.extension || FileSystem.defaultRenameExtension;
    const info = await FileSystem.info(path6);
    if (info.exists) {
      const newPath = path6 + extension;
      await FileSystem.moveOutOfTheWay(newPath, { extension });
      await move(path6, newPath);
    }
  },
  /**
   * find a root folder based on a child path
   *
   * @example
   * ```js
   *     import { FileSystem } from "https://deno.land/x/quickr/main/file_system.js"
   * 
   *     // option1: single subpath
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil(".git")
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil(".git/config")
   *     // option2: multiple subpaths
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil([".git/config", ".git/refs/heads/master"])
   *     // option3: function checker
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil(path=>FileSystem.exists(`${path}/.git`))
   *
   *     // change the startPath with a subPath
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil({startPath: FileSystem.pwd, subPath:".git"})
   *     // change the startPath with a function checker
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil({startPath: FileSystem.pwd}, path=>FileSystem.exists(`${path}/.git`))
   *```
   */
  async walkUpUntil(subPath, startPath = null) {
    var func, subPathStrs, startPath;
    if (subPath instanceof Function) {
      func = subPath;
      subPathStrs = [];
    } else if (subPath instanceof Array) {
      subPathStrs = subPath;
    } else if (subPath instanceof Object) {
      func = startPath;
      var { subPath, startPath } = subPath;
      subPathStrs = [subPath];
    } else {
      subPathStrs = [subPath];
    }
    subPathStrs = subPathStrs.map((each2) => each2 instanceof Path ? each2.path : each2);
    if (!startPath) {
      startPath = Deno.cwd();
    } else if (isAbsolute3(startPath)) {
      startPath = startPath;
    } else {
      startPath = join4(here, startPath);
    }
    let here = startPath;
    while (1) {
      const check = func ? await func(here) : (await Promise.all(subPathStrs.map((each2) => Deno.lstat(join4(here, each2)).catch(() => false)))).some((each2) => each2);
      if (check) {
        return here;
      }
      if (here == dirname3(here)) {
        return null;
      } else {
        here = dirname3(here);
      }
    }
  },
  async copy({ from, to, preserveTimestamps = true, force = true, overwrite = false, renameExtension = null }) {
    const cache3 = {};
    const oldHardPath = FileSystem.sync.makeHardPathTo(from, { cache: cache3 });
    const newHardPath = FileSystem.sync.makeHardPathTo(to, { cache: cache3 });
    if (oldHardPath == newHardPath) {
      console.warn(`
Tried to copy from:${from}, to:${to}
but "from" and "to" were the same

`);
      return;
    }
    const existingItemDoesntExist = (await Deno.stat(from).catch(() => ({ doesntExist: true }))).doesntExist;
    if (existingItemDoesntExist) {
      throw Error(`
Tried to copy from:${from}, to:${to}
but "from" didn't seem to exist

`);
    }
    if (force) {
      FileSystem.sync.clearAPathFor(to, { overwrite, renameExtension });
    }
    return copy2(from, to, { force, preserveTimestamps: true });
  },
  async relativeLink({ existingItem, newItem, force = true, overwrite = false, allowNonExistingTarget = false, renameExtension = null }) {
    const existingItemPath = (existingItem.path || existingItem).replace(/\/+$/, "");
    const newItemPath = FileSystem.normalizePath((newItem.path || newItem).replace(/\/+$/, ""));
    const existingItemDoesntExist = (await Deno.lstat(existingItemPath).catch(() => ({ doesntExist: true }))).doesntExist;
    if (!allowNonExistingTarget && existingItemDoesntExist) {
      throw Error(`
Tried to create a relativeLink between existingItem:${existingItemPath}, newItem:${newItemPath}
but existingItem didn't actually exist`);
    } else {
      const parentOfNewItem = FileSystem.parentPath(newItemPath);
      await FileSystem.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
      const hardPathToNewItem = `${await FileSystem.makeHardPathTo(parentOfNewItem)}/${FileSystem.basename(newItemPath)}`;
      const hardPathToExistingItem = await FileSystem.makeHardPathTo(existingItemPath);
      const pathFromNewToExisting = relative3(hardPathToNewItem, hardPathToExistingItem).replace(/^\.\.\//, "");
      if (force) {
        FileSystem.sync.clearAPathFor(hardPathToNewItem, { overwrite, renameExtension });
      }
      return Deno.symlink(
        pathFromNewToExisting,
        hardPathToNewItem
      );
    }
  },
  async absoluteLink({ existingItem, newItem, force = true, allowNonExistingTarget = false, overwrite = false, renameExtension = null }) {
    existingItem = (existingItem.path || existingItem).replace(/\/+$/, "");
    const newItemPath = FileSystem.normalizePath(newItem.path || newItem).replace(/\/+$/, "");
    const existingItemDoesntExist = (await Deno.lstat(existingItem).catch(() => ({ doesntExist: true }))).doesntExist;
    if (!allowNonExistingTarget && existingItemDoesntExist) {
      throw Error(`
Tried to create a relativeLink between existingItem:${existingItem}, newItemPath:${newItemPath}
but existingItem didn't actually exist`);
    } else {
      const parentOfNewItem = FileSystem.parentPath(newItemPath);
      await FileSystem.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
      const hardPathToNewItem = `${await FileSystem.makeHardPathTo(parentOfNewItem)}/${FileSystem.basename(newItemPath)}`;
      if (force) {
        FileSystem.sync.clearAPathFor(hardPathToNewItem, { overwrite, renameExtension });
      }
      return Deno.symlink(
        FileSystem.makeAbsolutePath(existingItem),
        newItemPath
      );
    }
  },
  async hardLink({ existingItem, newItem, force = true, overwrite = false, renameExtension = null, hardLink = false }) {
    existingItem = (existingItem.path || existingItem).replace(/\/+$/, "");
    const newItemPath = FileSystem.normalizePath(newItem.path || newItem).replace(/\/+$/, "");
    const existingItemDoesntExist = (await Deno.lstat(existingItem).catch(() => ({ doesntExist: true }))).doesntExist;
    if (existingItemDoesntExist) {
      throw Error(`
Tried to create a relativeLink between existingItem:${existingItem}, newItemPath:${newItemPath}
but existingItem didn't actually exist`);
    } else {
      const parentOfNewItem = FileSystem.parentPath(newItemPath);
      await FileSystem.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
      if (force) {
        FileSystem.sync.clearAPathFor(newItem, { overwrite, renameExtension });
      }
      return Deno.link(
        FileSystem.makeAbsolutePath(existingItem),
        newItemPath
      );
    }
  },
  async *iterateBasenamesIn(pathOrFileInfo) {
    const info = pathOrFileInfo instanceof Path ? pathOrFileInfo : await FileSystem.info(pathOrFileInfo);
    if (info.isFolder) {
      for await (const dirEntry of Deno.readDir(info.path)) {
        yield dirEntry.name;
      }
    }
  },
  listBasenamesIn(pathOrFileInfo) {
    return w(FileSystem.iterateBasenamesIn(pathOrFileInfo));
  },
  async *iteratePathsIn(pathOrFileInfo, options = { recursively: false, shouldntInclude: null, shouldntExplore: null, searchOrder: "breadthFirstSearch", maxDepth: Infinity, dontFollowSymlinks: false, dontReturnSymlinks: false, maxDepthFromRoot: null }) {
    let info;
    try {
      info = pathOrFileInfo instanceof Path ? pathOrFileInfo : await FileSystem.info(pathOrFileInfo);
    } catch (error) {
      if (!error.message.match(/^PermissionDenied:/)) {
        throw error;
      }
    }
    const path6 = info.path;
    const startingDepth = FileSystem.makeAbsolutePath(path6).split("/").length - 1;
    options.recursively = options.recursively == false && options.maxDepth == 1 ? false : options.recursively;
    if (options.maxDepthFromRoot == null) {
      options.maxDepthFromRoot = Infinity;
    }
    if (options.maxDepth != Infinity && options.maxDepth != null) {
      options.maxDepthFromRoot = startingDepth + options.maxDepth;
    }
    options.maxDepth = null;
    if (startingDepth < options.maxDepthFromRoot) {
      if (!options.recursively) {
        if (info.isFolder) {
          if (!options.shouldntInclude) {
            for await (const each2 of Deno.readDir(path6)) {
              if (options.dontReturnSymlinks && each2.isSymlink) {
                continue;
              }
              yield join4(path6, each2.name);
            }
          } else {
            const shouldntInclude = options.shouldntInclude;
            for await (const each2 of Deno.readDir(path6)) {
              const eachPath2 = join4(path6, each2.name);
              if (options.dontReturnSymlinks && each2.isSymlink) {
                continue;
              }
              const shouldntIncludeThis = shouldntInclude && await shouldntInclude(eachPath2);
              if (!shouldntIncludeThis) {
                yield eachPath2;
              }
            }
          }
        }
      } else {
        options = { exclude: /* @__PURE__ */ new Set(), searchOrder: "breadthFirstSearch", maxDepth: Infinity, ...options };
        options.searchOrder = options.searchOrder || "breadthFirstSearch";
        const { shouldntExplore, shouldntInclude } = options;
        if (!["breadthFirstSearch", "depthFirstSearch"].includes(options.searchOrder)) {
          throw Error(`when calling FileSystem.iterateItemsIn('${path6}', { searchOrder: ${options.searchOrder} })

    The searchOrder currently can only be 'depthFirstSearch' or 'breadthFirstSearch'
    However, it was not either of those: ${options.searchOrder}`);
        }
        const useBreadthFirstSearch = options.searchOrder == "breadthFirstSearch";
        const shouldntExploreThis = shouldntExplore && await shouldntExplore(info.path, info);
        if (!shouldntExploreThis && info.isFolder) {
          options.exclude = options.exclude instanceof Set ? options.exclude : new Set(options.exclude);
          if (!options.exclude.has(path6)) {
            const followSymlinks = !options.dontFollowSymlinks;
            const absolutePathVersion = FileSystem.makeAbsolutePath(path6);
            options.exclude.add(absolutePathVersion);
            const searchAfterwords = [];
            for await (const entry of Deno.readDir(path6)) {
              const eachPath2 = join4(path6, entry.name);
              if (options.dontReturnSymlinks && each.isSymlink) {
                continue;
              }
              const shouldntIncludeThis = shouldntInclude && await shouldntInclude(eachPath2);
              if (!shouldntIncludeThis) {
                yield eachPath2;
              }
              const isNormalFileHardlink = entry.isFile;
              const isWeirdItem = !entry.isDirectory && !isNormalFileHardlink && !entry.isSymlink;
              if (isNormalFileHardlink || isWeirdItem) {
                continue;
              }
              if (followSymlinks && !entry.isDirectory) {
                let isSymlinkToDirectory = false;
                try {
                  isSymlinkToDirectory = (await Deno.stat(eachPath2)).isDirectory;
                } catch (error) {
                }
                if (!isSymlinkToDirectory) {
                  continue;
                }
              }
              if (useBreadthFirstSearch) {
                searchAfterwords.push(eachPath2);
              } else {
                for await (const eachSubPath of FileSystem.iteratePathsIn(eachPath2, options)) {
                  yield eachSubPath;
                }
              }
            }
            options.recursively = false;
            while (searchAfterwords.length > 0) {
              const next = searchAfterwords.shift();
              for await (const eachSubPath of FileSystem.iteratePathsIn(next, options)) {
                yield eachSubPath;
                searchAfterwords.push(eachSubPath);
              }
            }
          }
        }
      }
    }
  },
  listPathsIn(pathOrFileInfo, options) {
    return w(FileSystem.iteratePathsIn(pathOrFileInfo, options));
  },
  async *iterateItemsIn(pathOrFileInfo, options = { recursively: false, shouldntInclude: null, shouldntExplore: null, searchOrder: "breadthFirstSearch", maxDepth: Infinity }) {
    options = { exclude: /* @__PURE__ */ new Set(), searchOrder: "breadthFirstSearch", maxDepth: Infinity, ...options };
    options.searchOrder = options.searchOrder || "breadthFirstSearch";
    options.recursively = options.recursively == false && options.maxDepth == 1 ? false : options.recursively;
    const { shouldntExplore, shouldntInclude } = options;
    const info = pathOrFileInfo instanceof Path ? pathOrFileInfo : await FileSystem.info(pathOrFileInfo);
    const path6 = info.path;
    if (!["breadthFirstSearch", "depthFirstSearch"].includes(options.searchOrder)) {
      throw Error(`when calling FileSystem.iterateItemsIn('${path6}', { searchOrder: ${options.searchOrder} })

    The searchOrder currently can only be 'depthFirstSearch' or 'breadthFirstSearch'
    However, it was not either of those: ${options.searchOrder}`);
    }
    const useBreadthFirstSearch = options.searchOrder == "breadthFirstSearch";
    const shouldntExploreThis = shouldntExplore && await shouldntExplore(info);
    if (!shouldntExploreThis && options.maxDepth > 0 && info.isFolder) {
      options.exclude = options.exclude instanceof Set ? options.exclude : new Set(options.exclude);
      if (!options.exclude.has(path6)) {
        const absolutePathVersion = FileSystem.makeAbsolutePath(path6);
        options.exclude.add(absolutePathVersion);
        options.maxDepth -= 1;
        const searchAfterwords = [];
        for await (const entry of Deno.readDir(path6)) {
          const eachItem = await FileSystem.info(join4(path6, entry.name));
          const shouldntIncludeThis = shouldntInclude && await shouldntInclude(eachItem);
          if (!shouldntIncludeThis) {
            yield eachItem;
          }
          if (options.recursively) {
            if (eachItem.isFolder) {
              if (useBreadthFirstSearch) {
                searchAfterwords.push(eachItem);
              } else {
                for await (const eachSubPath of FileSystem.iterateItemsIn(eachItem, options)) {
                  yield eachSubPath;
                }
              }
            }
          }
        }
        options.recursively = false;
        while (searchAfterwords.length > 0) {
          const next = searchAfterwords.shift();
          for await (const eachSubItem of FileSystem.iterateItemsIn(next, options)) {
            yield eachSubItem;
            if (eachSubItem.isFolder) {
              searchAfterwords.push(eachSubItem);
            }
          }
        }
      }
    }
  },
  async listItemsIn(pathOrFileInfo, options) {
    const outputPromises = [];
    for await (const eachPath2 of FileSystem.iteratePathsIn(pathOrFileInfo, options)) {
      outputPromises.push(FileSystem.info(eachPath2));
    }
    return Promise.all(outputPromises);
  },
  // includes symlinks if they link to files and pipes
  async listFileItemsIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
    const { treatAllSymlinksAsFiles } = { treatAllSymlinksAsFiles: false, ...options };
    const items = await FileSystem.listItemsIn(pathOrFileInfo, options);
    if (treatAllSymlinksAsFiles) {
      return items.filter((eachItem) => eachItem.isFile || eachItem.isSymlink);
    } else {
      return items.filter((eachItem) => eachItem.isFile);
    }
  },
  async listFilePathsIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
    return (await FileSystem.listFileItemsIn(pathOrFileInfo, options)).map((each2) => each2.path);
  },
  async listFileBasenamesIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
    return (await FileSystem.listFileItemsIn(pathOrFileInfo, options)).map((each2) => each2.basename);
  },
  async listFolderItemsIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
    const { ignoreSymlinks } = { ignoreSymlinks: false, ...options };
    const items = await FileSystem.listItemsIn(pathOrFileInfo, options);
    if (ignoreSymlinks) {
      return items.filter((eachItem) => eachItem.isFolder && !eachItem.isSymlink);
    } else {
      return items.filter((eachItem) => eachItem.isFolder);
    }
  },
  async listFolderPathsIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
    return (await FileSystem.listFolderItemsIn(pathOrFileInfo, options)).map((each2) => each2.path);
  },
  async listFolderBasenamesIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
    return (await FileSystem.listFolderItemsIn(pathOrFileInfo, options)).map((each2) => each2.basename);
  },
  recursivelyIterateItemsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
    options.recursively = true;
    if (options.onlyHardlinks) {
      if (options.shouldntInclude) {
        const originalshouldntInclude = options.shouldntInclude;
        options.shouldntInclude = (each2) => each2.isSymlink || originalshouldntInclude(each2);
      } else {
        options.shouldntInclude = (each2) => each2.isSymlink;
      }
    }
    if (options.dontFollowSymlinks) {
      if (options.shouldntExplore) {
        const originalShouldntExplore = options.shouldntInclude;
        options.shouldntExplore = (each2) => each2.isSymlink || originalShouldntExplore(each2);
      } else {
        options.shouldntExplore = (each2) => each2.isSymlink;
      }
    }
    return FileSystem.iterateItemsIn(pathOrFileInfo, options);
  },
  recursivelyIteratePathsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
    options.recursively = true;
    if (options.onlyHardlinks) {
      if (options.shouldntInclude) {
        const originalshouldntInclude = options.shouldntInclude;
        options.shouldntInclude = (each2) => each2.isSymlink || originalshouldntInclude(each2);
      } else {
        options.shouldntInclude = (each2) => each2.isSymlink;
      }
    }
    return FileSystem.iteratePathsIn(pathOrFileInfo, options);
  },
  recursivelyListPathsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
    return w(FileSystem.recursivelyIteratePathsIn(pathOrFileInfo, options));
  },
  recursivelyListItemsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
    return w(FileSystem.recursivelyIterateItemsIn(pathOrFileInfo, options));
  },
  async *globIterator(pattern, options = { startPath: null, returnFullPaths: false }) {
    pattern = FileSystem.normalizePath(pattern);
    var { startPath, ...iteratePathsOptions } = options;
    startPath = startPath || "./";
    const originalStartPath = startPath;
    const firstGlob = pattern.match(/[\[\*\{\?]/);
    let extendedStartPath = startPath;
    if (firstGlob) {
      const startingString = pattern.slice(0, firstGlob.index);
      const furthestConstantSlash = startingString.lastIndexOf("/");
      if (furthestConstantSlash != -1) {
        if (pattern[0] == "/") {
          extendedStartPath = pattern.slice(0, furthestConstantSlash);
        } else {
          extendedStartPath = `${extendedStartPath}/${pattern.slice(0, furthestConstantSlash)}`;
        }
      }
      pattern = pattern.slice(furthestConstantSlash + 1);
    }
    extendedStartPath = FileSystem.makeAbsolutePath(extendedStartPath);
    let maxDepthFromRoot;
    if (pattern.match(/\*\*/)) {
      maxDepthFromRoot = Infinity;
    } else {
      maxDepthFromRoot = `${extendedStartPath}/${pattern}`.split("/").length - 1;
    }
    const fullPattern = `${escapeGlob(extendedStartPath)}/${pattern}`;
    const regex = globToRegExp4(fullPattern);
    const partials = fullPattern.split("/");
    let partialPattern = partials.shift();
    let partialRegexString = `^\\.$|${globToRegExp4(partialPattern || "/").source}`;
    for (const each2 of partials) {
      partialPattern += "/" + each2;
      partialRegexString += "|" + globToRegExp4(partialPattern).source;
    }
    const partialRegex = new RegExp(partialRegexString);
    for await (const eachPath2 of FileSystem.iteratePathsIn(extendedStartPath, { recursively: true, maxDepthFromRoot, ...iteratePathsOptions, shouldntExplore: (eachInnerPath) => !eachInnerPath.match(partialRegex) })) {
      if (eachPath2.match(regex) || FileSystem.makeAbsolutePath(eachPath2).match(regex)) {
        if (options.returnFullPaths) {
          yield eachPath2;
        } else {
          yield FileSystem.makeRelativePath({
            from: originalStartPath,
            to: eachPath2
          });
        }
      }
    }
  },
  glob(pattern, options = { startPath: null }) {
    return w(FileSystem.globIterator(pattern, options));
  },
  async getPermissions(path6) {
    const { mode } = await Deno.lstat(path6?.path || path6);
    return {
      owner: {
        //          rwxrwxrwx
        canRead: !!(256 & mode),
        canWrite: !!(128 & mode),
        canExecute: !!(64 & mode)
      },
      group: {
        canRead: !!(32 & mode),
        canWrite: !!(16 & mode),
        canExecute: !!(8 & mode)
      },
      others: {
        canRead: !!(4 & mode),
        canWrite: !!(2 & mode),
        canExecute: !!(1 & mode)
      }
    };
  },
  /**
  * Add/set file permissions
  *
  * @param {String} args.path - 
  * @param {Object|Boolean} args.recursively - 
  * @param {Object} args.permissions - 
  * @param {Object} args.permissions.owner - 
  * @param {Boolean} args.permissions.owner.canRead - 
  * @param {Boolean} args.permissions.owner.canWrite - 
  * @param {Boolean} args.permissions.owner.canExecute - 
  * @param {Object} args.permissions.group - 
  * @param {Boolean} args.permissions.group.canRead - 
  * @param {Boolean} args.permissions.group.canWrite - 
  * @param {Boolean} args.permissions.group.canExecute - 
  * @param {Object} args.permissions.others - 
  * @param {Boolean} args.permissions.others.canRead - 
  * @param {Boolean} args.permissions.others.canWrite - 
  * @param {Boolean} args.permissions.others.canExecute - 
  * @return {null} 
  *
  * @example
  * ```js
  *  await FileSystem.addPermissions({
  *      path: fileOrFolderPath,
  *      permissions: {
  *          owner: {
  *              canExecute: true,
  *          },
  *      }
  *  })
  * ```
  */
  async addPermissions({ path: path6, permissions: permissions2 = { owner: {}, group: {}, others: {} }, recursively = false }) {
    permissions2 = { owner: {}, group: {}, others: {}, ...permissions2 };
    let permissionNumber = 0;
    let fileInfo;
    if ([permissions2.owner, permissions2.group, permissions2.others].some((each2) => !each2 || Object.keys(each2).length != 3)) {
      fileInfo = await FileSystem.info(path6);
      permissionNumber = fileInfo.lstat.mode & 511;
    }
    if (permissions2.owner.canRead != null) {
      permissionNumber = permissions2.owner.canRead ? setTrueBit(permissionNumber, 8) : setFalseBit(permissionNumber, 8);
    }
    if (permissions2.owner.canWrite != null) {
      permissionNumber = permissions2.owner.canWrite ? setTrueBit(permissionNumber, 7) : setFalseBit(permissionNumber, 7);
    }
    if (permissions2.owner.canExecute != null) {
      permissionNumber = permissions2.owner.canExecute ? setTrueBit(permissionNumber, 6) : setFalseBit(permissionNumber, 6);
    }
    if (permissions2.group.canRead != null) {
      permissionNumber = permissions2.group.canRead ? setTrueBit(permissionNumber, 5) : setFalseBit(permissionNumber, 5);
    }
    if (permissions2.group.canWrite != null) {
      permissionNumber = permissions2.group.canWrite ? setTrueBit(permissionNumber, 4) : setFalseBit(permissionNumber, 4);
    }
    if (permissions2.group.canExecute != null) {
      permissionNumber = permissions2.group.canExecute ? setTrueBit(permissionNumber, 3) : setFalseBit(permissionNumber, 3);
    }
    if (permissions2.others.canRead != null) {
      permissionNumber = permissions2.others.canRead ? setTrueBit(permissionNumber, 2) : setFalseBit(permissionNumber, 2);
    }
    if (permissions2.others.canWrite != null) {
      permissionNumber = permissions2.others.canWrite ? setTrueBit(permissionNumber, 1) : setFalseBit(permissionNumber, 1);
    }
    if (permissions2.others.canExecute != null) {
      permissionNumber = permissions2.others.canExecute ? setTrueBit(permissionNumber, 0) : setFalseBit(permissionNumber, 0);
    }
    if (!recursively || // init fileInfo if doesnt exist
    (fileInfo || (fileInfo = await FileSystem.info(path6))) && !fileInfo.isDirectory) {
      return Deno.chmod(path6?.path || path6, permissionNumber);
    } else {
      const promises = [];
      const paths = await FileSystem.recursivelyListPathsIn(path6, { onlyHardlinks: false, dontFollowSymlinks: false, ...recursively });
      for (const eachPath2 of paths) {
        promises.push(
          Deno.chmod(eachPath2, permissionNumber).catch(console.error)
        );
      }
      return Promise.all(promises);
    }
  },
  // alias
  setPermissions(...args2) {
    return FileSystem.addPermissions(...args2);
  },
  async write({ path: path6, data, force = true, overwrite = false, renameExtension = null }) {
    path6 = pathStandardize(path6);
    await grabPathLock(path6);
    if (force) {
      FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path6), { overwrite, renameExtension });
      const info = FileSystem.sync.info(path6);
      if (info.isDirectory) {
        FileSystem.sync.remove(path6);
      }
    }
    let output2;
    if (typeof data == "string") {
      output2 = await Deno.writeTextFile(path6, data);
    } else if (r2.some((dataClass) => data instanceof dataClass)) {
      output2 = await Deno.writeFile(path6, data);
    } else if (f(data) || data[Symbol.iterator] || data[Symbol.asyncIterator]) {
      const file = await Deno.open(path6, { read: true, write: true, create: true, truncate: true });
      const encoder = new TextEncoder();
      const encode = encoder.encode.bind(encoder);
      try {
        let index = 0;
        for await (let packet of data) {
          if (typeof packet == "string") {
            packet = encode(packet);
          }
          await Deno.write(file.rid, packet);
        }
      } finally {
        Deno?.close?.(file.rid);
      }
    }
    delete locker[path6];
    return output2;
  },
  async append({ path: path6, data, force = true, overwrite = false, renameExtension = null }) {
    path6 = pathStandardize(path6);
    await grabPathLock(path6);
    if (force) {
      FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path6), { overwrite, renameExtension });
      const info = FileSystem.sync.info(path6);
      if (info.isDirectory) {
        FileSystem.sync.remove(path6);
      }
    }
    if (typeof data == "string") {
      data = new TextEncoder().encode(data);
    }
    const file = Deno.openSync(path6, { read: true, write: true, create: true });
    file.seekSync(0, Deno.SeekMode.End);
    file.writeSync(data);
    file.close();
    delete locker[path6];
  },
  async makeHardPathTo(path6, options = {}) {
    var { cache: cache3 } = { cache: {}, ...options };
    if (cache3[path6]) {
      return cache3[path6];
    }
    const [folders, name, extension] = FileSystem.pathPieces(FileSystem.makeAbsolutePath(path6));
    let topDownPath = ``;
    for (const eachFolderName of folders) {
      topDownPath += `/${eachFolderName}`;
      if (cache3[topDownPath]) {
        topDownPath = cache3[topDownPath];
        continue;
      }
      const unchangedPath = topDownPath;
      const info = await FileSystem.info(topDownPath);
      if (info.isSymlink) {
        const absolutePathToIntermediate = await FileSystem.finalTargetOf(info.path, { _parentsHaveBeenChecked: true, cache: cache3 });
        if (absolutePathToIntermediate == null) {
          return null;
        }
        topDownPath = topDownPath.slice(0, -(eachFolderName.length + 1));
        const relativePath = FileSystem.makeRelativePath({
          from: topDownPath,
          to: absolutePathToIntermediate
        });
        topDownPath += `/${relativePath}`;
        topDownPath = normalize4(topDownPath);
      }
      cache3[unchangedPath] = topDownPath;
    }
    const hardPath = normalize4(`${topDownPath}/${name}${extension}`);
    cache3[path6] = hardPath;
    return hardPath;
  },
  async walkUpImport(path6, start) {
    const startPath = start || FileSystem.pathOfCaller(1);
    const nearestPath = await FileSystem.walkUpUntil(path6, startPath);
    if (nearestPath) {
      const absolutePath = FileSystem.makeAbsolutePath(`${nearestPath}/${path6}`);
      return import(toFileUrl3(absolutePath).href);
    } else {
      throw Error(`Tried to walkUpImport ${path6}, starting at ${startPath}, but was unable to find any files`);
    }
  },
  async withPwd(tempPwd, func) {
    const originalPwd = FileSystem.pwd;
    const originalPwdEnvVar = Deno.env.get("PWD");
    tempPwd = FileSystem.makeAbsolutePath(tempPwd);
    try {
      FileSystem.pwd = tempPwd;
      Deno.env.set("PWD", tempPwd);
      await func(originalPwd);
    } finally {
      FileSystem.pwd = originalPwd;
      Deno.env.set("PWD", originalPwdEnvVar);
    }
  },
  parentOfAllPaths(paths) {
    let parentPaths = [];
    if (!paths.every(FileSystem.isRelativePath)) {
      paths = paths.map(FileSystem.makeAbsolutePath);
    }
    for (let eachPath2 of paths) {
      const [folders, itemName, itemExtensionWithDot] = FileSystem.pathPieces(eachPath2);
      parentPaths.push(folders.join("/") + "/");
    }
    let possiblyBrokenPath = m2(parentPaths);
    if (!possiblyBrokenPath.endsWith("/")) {
      possiblyBrokenPath = possiblyBrokenPath.split("/").slice(0, -1).join("/") + "/";
    }
    return FileSystem.normalizePath(possiblyBrokenPath);
  },
  sync: {
    // things that are already sync
    get parentPath() {
      return FileSystem.parentPath;
    },
    get dirname() {
      return FileSystem.dirname;
    },
    get basename() {
      return FileSystem.basename;
    },
    get extname() {
      return FileSystem.extname;
    },
    get join() {
      return FileSystem.join;
    },
    get thisFile() {
      return FileSystem.thisFile;
    },
    get pureNameOf() {
      return A2;
    },
    get thisFolder() {
      return FileSystem.thisFolder;
    },
    get normalize() {
      return FileSystem.normalizePath;
    },
    get isAbsolutePath() {
      return FileSystem.isAbsolutePath;
    },
    get isRelativePath() {
      return FileSystem.isRelativePath;
    },
    get makeRelativePath() {
      return FileSystem.makeRelativePath;
    },
    get makeAbsolutePath() {
      return FileSystem.makeAbsolutePath;
    },
    get pathDepth() {
      return FileSystem.pathDepth;
    },
    get pathPieces() {
      return FileSystem.pathPieces;
    },
    get extendName() {
      return FileSystem.extendName;
    },
    get allParentPaths() {
      return FileSystem.allParentPaths;
    },
    get pathOfCaller() {
      return FileSystem.pathOfCaller;
    },
    get home() {
      return FileSystem.home;
    },
    get workingDirectory() {
      return FileSystem.workingDirectory;
    },
    get cwd() {
      return FileSystem.cwd;
    },
    get pwd() {
      return FileSystem.pwd;
    },
    get cd() {
      return FileSystem.cd;
    },
    get changeDirectory() {
      return FileSystem.changeDirectory;
    },
    set workingDirectory(value) {
      return FileSystem.workingDirectory = value;
    },
    set cwd(value) {
      return FileSystem.workingDirectory = value;
    },
    set pwd(value) {
      return FileSystem.workingDirectory = value;
    },
    info(fileOrFolderPath, _cachedLstat = null) {
      let lstat2 = _cachedLstat;
      try {
        lstat2 = Deno.lstatSync(fileOrFolderPath);
      } catch (error) {
        lstat2 = { doesntExist: true };
      }
      let stat2 = {};
      if (!lstat2.isSymlink) {
        stat2 = {
          isBrokenLink: false,
          isLoopOfLinks: false
        };
      } else {
        try {
          stat2 = Deno.statSync(fileOrFolderPath);
        } catch (error) {
          if (error.message.match(/^Too many levels of symbolic links/)) {
            stat2.isBrokenLink = true;
            stat2.isLoopOfLinks = true;
          } else if (error.message.match(/^No such file or directory/)) {
            stat2.isBrokenLink = true;
          } else {
            throw error;
          }
        }
      }
      return new Path({ path: fileOrFolderPath, _lstatData: lstat2, _statData: stat2 });
    },
    read(path6) {
      path6 = pathStandardize(path6);
      let output2;
      try {
        output2 = Deno.readTextFileSync(path6);
      } catch (error) {
      }
      return output2;
    },
    readBytes(path6) {
      path6 = pathStandardize(path6);
      let output2;
      try {
        output2 = Deno.readFileSync(path6);
      } catch (error) {
      }
      return output2;
    },
    *readLinesIteratively(path6) {
      path6 = pathStandardize(path6);
      const file = Deno.openSync(path6);
      try {
        yield* readLines(file);
      } finally {
        Deno?.close?.(file.rid);
      }
    },
    /**
     * find a root folder based on a child path
     *
     * @example
     * ```js
     *     import { FileSystem } from "https://deno.land/x/quickr/main/file_system.js"
     * 
     *     var gitParentFolderOrNull = FileSystem.sync.walkUpUntil(".git")
     *     var gitParentFolderOrNull = FileSystem.sync.walkUpUntil({
     *         subPath:".git",
     *         startPath: FileSystem.pwd,
     *     })
     *
     *     // below will result in that^ same folder (assuming all your .git folders have config files)
     *     var gitParentFolderOrNull = FileSystem.sync.walkUpUntil(".git/config")
     * 
     *     // below will result in the same folder, but only if theres a local master branch
     *     var gitParentFolderOrNull = FileSystem.sync.walkUpUntil(".git/refs/heads/master")
     *```
     */
    walkUpUntil(subPath, startPath = null) {
      subPath = subPath instanceof Path ? subPath.path : subPath;
      if (subPath instanceof Object) {
        var { subPath, startPath } = subPath;
      }
      let here;
      if (!startPath) {
        here = Deno.cwd();
      } else if (isAbsolute3(startPath)) {
        here = startPath;
      } else {
        here = join4(here, startPath);
      }
      while (1) {
        let checkPath = join4(here, subPath);
        let exists2 = false;
        let item;
        try {
          item = Deno.lstatSync(checkPath);
          exists2 = true;
        } catch (error) {
        }
        const pathInfo = item;
        if (exists2) {
          return here;
        }
        if (here == dirname3(here)) {
          return null;
        } else {
          here = dirname3(here);
        }
      }
    },
    nextTargetOf(path6, options = {}) {
      const originalWasItem = path6 instanceof Path;
      const item = originalWasItem ? path6 : new Path({ path: path6 });
      const lstat2 = item.lstat;
      if (lstat2.isSymlink) {
        const relativeOrAbsolutePath = Deno.readLinkSync(item.path);
        if (isAbsolute3(relativeOrAbsolutePath)) {
          if (originalWasItem) {
            return new Path({ path: relativeOrAbsolutePath });
          } else {
            return relativeOrAbsolutePath;
          }
        } else {
          const path7 = `${FileSystem.sync.makeHardPathTo(dirname3(item.path))}/${relativeOrAbsolutePath}`;
          if (originalWasItem) {
            return new Path({ path: path7 });
          } else {
            return path7;
          }
        }
      } else {
        if (originalWasItem) {
          return item;
        } else {
          return item.path;
        }
      }
    },
    finalTargetOf(path6, options = {}) {
      const { _parentsHaveBeenChecked, cache: cache3 } = { _parentsHaveBeenChecked: false, cache: {}, ...options };
      const originalWasItem = path6 instanceof Path;
      path6 = path6.path || path6;
      let exists2 = false;
      let item;
      try {
        item = Deno.lstatSync(path6);
        exists2 = true;
      } catch (error) {
      }
      let result = item;
      if (!exists2) {
        return null;
      }
      path6 = FileSystem.sync.makeHardPathTo(path6, { cache: cache3 });
      const pathChain = [];
      while (result.isSymlink) {
        const relativeOrAbsolutePath = Deno.readLinkSync(path6);
        if (isAbsolute3(relativeOrAbsolutePath)) {
          path6 = relativeOrAbsolutePath;
        } else {
          path6 = `${FileSystem.parentPath(path6)}/${relativeOrAbsolutePath}`;
        }
        let exists3 = false;
        let item2;
        try {
          item2 = Deno.lstatSync(path6);
          exists3 = true;
        } catch (error) {
        }
        result = item2;
        if (!exists3) {
          return null;
        }
        path6 = FileSystem.sync.makeHardPathTo(path6, { cache: cache3 });
        if (pathChain.includes(path6)) {
          return null;
        }
        pathChain.push(path6);
      }
      path6 = FileSystem.normalizePath(path6);
      if (originalWasItem) {
        return new Path({ path: path6 });
      } else {
        return path6;
      }
    },
    makeHardPathTo(path6, options = {}) {
      var { cache: cache3 } = { cache: {}, ...options };
      if (cache3[path6]) {
        return cache3[path6];
      }
      const [folders, name, extension] = FileSystem.pathPieces(FileSystem.makeAbsolutePath(path6));
      let topDownPath = ``;
      for (const eachFolderName of folders) {
        topDownPath += `/${eachFolderName}`;
        if (cache3[topDownPath]) {
          topDownPath = cache3[topDownPath];
          continue;
        }
        const unchangedPath = topDownPath;
        const info = FileSystem.sync.info(topDownPath);
        if (info.isSymlink) {
          const absolutePathToIntermediate = FileSystem.sync.finalTargetOf(info.path, { _parentsHaveBeenChecked: true, cache: cache3 });
          if (absolutePathToIntermediate == null) {
            return null;
          }
          topDownPath = topDownPath.slice(0, -(eachFolderName.length + 1));
          const relativePath = FileSystem.makeRelativePath({
            from: topDownPath,
            to: absolutePathToIntermediate
          });
          topDownPath += `/${relativePath}`;
          topDownPath = normalize4(topDownPath);
        }
        cache3[unchangedPath] = topDownPath;
      }
      const hardPath = normalize4(`${topDownPath}/${name}${extension}`);
      cache3[path6] = hardPath;
      return hardPath;
    },
    remove(fileOrFolder) {
      fileOrFolder = pathStandardize(fileOrFolder);
      if (fileOrFolder instanceof Array) {
        return fileOrFolder.map(FileSystem.sync.remove);
      }
      let exists2 = false;
      let item;
      try {
        item = Deno.lstatSync(fileOrFolder);
        exists2 = true;
      } catch (error) {
      }
      if (exists2) {
        if (item.isFile || item.isSymlink || !item.isDirectory) {
          return Deno.removeSync(fileOrFolder.replace(/\/+$/, ""));
        } else {
          return Deno.removeSync(fileOrFolder.replace(/\/+$/, ""), { recursive: true });
        }
      }
    },
    moveOutOfTheWay(path6, options = { extension: null }) {
      path6 = pathStandardize(path6);
      const extension = options?.extension || FileSystem.defaultRenameExtension;
      const info = FileSystem.sync.info(path6);
      if (info.exists) {
        const newPath = path6 + extension;
        FileSystem.sync.moveOutOfTheWay(newPath, { extension });
        moveSync(path6, newPath);
      }
    },
    ensureIsFolder(path6, options = { overwrite: false, renameExtension: null }) {
      path6 = pathStandardize(path6);
      const { overwrite, renameExtension } = defaultOptionsHelper(options);
      path6 = path6.path || path6;
      path6 = FileSystem.makeAbsolutePath(path6);
      const parentPath = dirname3(path6);
      if (parentPath == path6) {
        return;
      }
      const parent = FileSystem.sync.info(parentPath);
      if (!parent.isDirectory) {
        FileSystem.sync.ensureIsFolder(parentPath, { overwrite, renameExtension });
      }
      let pathInfo = FileSystem.sync.info(path6);
      if (pathInfo.exists && !pathInfo.isDirectory) {
        if (overwrite) {
          FileSystem.sync.remove(path6);
        } else {
          FileSystem.sync.moveOutOfTheWay(path6, { extension: renameExtension });
        }
      }
      Deno.mkdirSync(path6, { recursive: true });
      return path6;
    },
    ensureIsFile(path6, options = { overwrite: false, renameExtension: null }) {
      const { overwrite, renameExtension } = defaultOptionsHelper(options);
      FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path6), { overwrite, renameExtension });
      path6 = path6.path || path6;
      const pathInfo = FileSystem.sync.info(path6);
      if (pathInfo.isFile && !pathInfo.isDirectory) {
        return path6;
      } else {
        FileSystem.sync.write({ path: path6, data: "" });
        return path6;
      }
    },
    /**
     * Move/Remove everything and Ensure parent folders
     *
     * @param path
     * @param options.overwrite - if false, then things in the way will be moved instead of deleted
     * @param options.extension - the string to append when renaming files to get them out of the way
     * 
     * @example
     * ```js
     *     FileSystem.sync.clearAPathFor("./something")
     * ```
     */
    clearAPathFor(path6, options = { overwrite: false, renameExtension: null }) {
      const { overwrite, renameExtension } = defaultOptionsHelper(options);
      const originalPath = path6;
      const paths = [];
      while (dirname3(path6) !== path6) {
        paths.push(path6);
        path6 = dirname3(path6);
      }
      for (const eachPath2 of paths.reverse()) {
        const info = FileSystem.sync.info(eachPath2);
        if (!info.exists) {
          break;
        } else if (info.isFile) {
          if (overwrite) {
            FileSystem.sync.remove(eachPath2);
          } else {
            FileSystem.sync.moveOutOfTheWay(eachPath2, { extension: renameExtension });
          }
        }
      }
      Deno.mkdirSync(dirname3(originalPath), { recursive: true });
      return originalPath;
    },
    append({ path: path6, data, force = true, overwrite = false, renameExtension = null }) {
      path6 = pathStandardize(path6);
      if (force) {
        FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path6), { overwrite, renameExtension });
        const info = FileSystem.sync.info(path6);
        if (info.isDirectory) {
          FileSystem.sync.remove(path6);
        }
      }
      const file = Deno.openSync(path6, { read: true, write: true, create: true });
      file.seekSync(0, Deno.SeekMode.End);
      if (typeof data == "string") {
        file.writeSync(new TextEncoder().encode(data));
      } else {
        file.writeSync(data);
      }
      file.close();
    },
    write({ path: path6, data, force = true, overwrite = false, renameExtension = null }) {
      path6 = pathStandardize(path6);
      if (force) {
        FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path6), { overwrite, renameExtension });
        const info = FileSystem.sync.info(path6);
        if (info.isDirectory) {
          FileSystem.sync.remove(path6);
        }
      }
      let output2;
      if (typeof data == "string") {
        output2 = Deno.writeTextFileSync(path6, data);
      } else if (r2.some((dataClass) => data instanceof dataClass)) {
        output2 = Deno.writeFileSync(path6, data);
      } else if (f(data) || data[Symbol.iterator] || data[Symbol.asyncIterator]) {
        const file = Deno.openSync(path6, { read: true, write: true, create: true, truncate: true });
        const encoder = new TextEncoder();
        const encode = encoder.encode.bind(encoder);
        try {
          let index = 0;
          for (let packet of data) {
            if (typeof packet == "string") {
              packet = encode(packet);
            }
            Deno.writeSync(file.rid, packet);
          }
        } finally {
          Deno?.close?.(file.rid);
        }
      }
      return output2;
    },
    absoluteLink({ existingItem, newItem, force = true, allowNonExistingTarget = false, overwrite = false, renameExtension = null }) {
      existingItem = (existingItem.path || existingItem).replace(/\/+$/, "");
      const newItemPath = FileSystem.normalizePath(newItem.path || newItem).replace(/\/+$/, "");
      let exists2 = false;
      let item;
      try {
        item = Deno.lstatSync(existingItem);
        exists2 = true;
      } catch (error) {
      }
      if (!allowNonExistingTarget && !exists2) {
        throw Error(`
Tried to create a relativeLink between existingItem:${existingItem}, newItemPath:${newItemPath}
but existingItem didn't actually exist`);
      } else {
        const parentOfNewItem = FileSystem.parentPath(newItemPath);
        FileSystem.sync.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
        const hardPathToNewItem = `${FileSystem.syncmakeHardPathTo(parentOfNewItem)}/${FileSystem.basename(newItemPath)}`;
        if (force) {
          FileSystem.sync.clearAPathFor(hardPathToNewItem, { overwrite, renameExtension });
        }
        return Deno.symlinkSync(
          FileSystem.makeAbsolutePath(existingItem),
          newItemPath
        );
      }
    },
    relativeLink({ existingItem, newItem, force = true, overwrite = false, allowNonExistingTarget = false, renameExtension = null }) {
      const existingItemPath = (existingItem.path || existingItem).replace(/\/+$/, "");
      const newItemPath = FileSystem.normalizePath((newItem.path || newItem).replace(/\/+$/, ""));
      let exists2 = false;
      let item;
      try {
        item = Deno.lstatSync(existingItemPath);
        exists2 = true;
      } catch (error) {
      }
      if (!allowNonExistingTarget && !exists2) {
        throw Error(`
Tried to create a relativeLink between existingItem:${existingItemPath}, newItem:${newItemPath}
but existingItem didn't actually exist`);
      } else {
        const parentOfNewItem = FileSystem.parentPath(newItemPath);
        FileSystem.sync.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
        const hardPathToNewItem = `${FileSystem.sync.makeHardPathTo(parentOfNewItem)}/${FileSystem.basename(newItemPath)}`;
        const hardPathToExistingItem = FileSystem.sync.makeHardPathTo(existingItemPath);
        const pathFromNewToExisting = relative3(hardPathToNewItem, hardPathToExistingItem).replace(/^\.\.\//, "");
        if (force) {
          FileSystem.sync.clearAPathFor(hardPathToNewItem, { overwrite, renameExtension });
        }
        return Deno.symlinkSync(
          pathFromNewToExisting,
          hardPathToNewItem
        );
      }
    },
    move({ path: path6, item, newParentFolder, newName, force = true, overwrite = false, renameExtension = null }) {
      item = item || path6;
      const oldPath = item.path || item;
      const oldName = FileSystem.basename(oldPath);
      const pathInfo = item instanceof Object || FileSystem.sync.info(oldPath);
      const newPath = `${newParentFolder || FileSystem.parentPath(oldPath)}/${newName || oldName}`;
      const cache3 = {};
      const oldHardPath = FileSystem.sync.makeHardPathTo(oldPath, { cache: cache3 });
      const newHardPath = FileSystem.sync.makeHardPathTo(newPath, { cache: cache3 });
      if (oldHardPath == newHardPath) {
        return;
      }
      if (pathInfo.isSymlink && !item.isBrokenLink) {
        const link2 = Deno.readLinkSync(pathInfo.path);
        if (!isAbsolute3(link2)) {
          const linkTargetBeforeMove = `${FileSystem.parentPath(pathInfo.path)}/${link2}`;
          FileSystem.sync.relativeLink({
            existingItem: linkTargetBeforeMove,
            newItem: newPath,
            force,
            overwrite,
            renameExtension
          });
          FileSystem.sync.remove(pathInfo);
        }
      }
      if (force) {
        FileSystem.sync.clearAPathFor(newPath, { overwrite, renameExtension });
      }
      return moveSync(oldPath, newPath);
    },
    rename({ from, to, force = true, overwrite = false, renameExtension = null }) {
      return FileSystem.sync.move({ path: from, newParentFolder: FileSystem.parentPath(to), newName: FileSystem.basename(to), force, overwrite, renameExtension });
    },
    copy({ from, to, preserveTimestamps = true, force = true, overwrite = false, renameExtension = null }) {
      const cache3 = {};
      const oldHardPath = FileSystem.sync.makeHardPathTo(from, { cache: cache3 });
      const newHardPath = FileSystem.sync.makeHardPathTo(to, { cache: cache3 });
      if (oldHardPath == newHardPath) {
        console.warn(`
Tried to copy from:${from}, to:${to}
but "from" and "to" were the same

`);
        return;
      }
      try {
        Deno.statSync(from);
      } catch (error) {
        throw Error(`
Tried to copy from:${from}, to:${to}
but "from" didn't seem to exist

`);
      }
      if (force) {
        FileSystem.sync.clearAPathFor(to, { overwrite, renameExtension });
      }
      return copySync(from, to, { force, preserveTimestamps: true });
    },
    *iterateBasenamesIn(pathOrFileInfo) {
      const info = pathOrFileInfo instanceof Path ? pathOrFileInfo : FileSystem.sync.info(pathOrFileInfo);
      if (info.isFolder) {
        for (const dirEntry of Deno.readDirSync(info.path)) {
          yield dirEntry.name;
        }
      }
    },
    listBasenamesIn(pathOrFileInfo) {
      return [...FileSystem.sync.iterateBasenamesIn(pathOrFileInfo)];
    },
    *iteratePathsIn(pathOrFileInfo, options = { recursively: false, shouldntInclude: null, shouldntExplore: null, searchOrder: "breadthFirstSearch", maxDepth: Infinity, dontFollowSymlinks: false, dontReturnSymlinks: false, maxDepthFromRoot: null }) {
      let info;
      try {
        info = pathOrFileInfo instanceof Path ? pathOrFileInfo : FileSystem.sync.info(pathOrFileInfo);
      } catch (error) {
        if (!error.message.match(/^PermissionDenied:/)) {
          throw error;
        }
      }
      const path6 = info.path;
      const startingDepth = FileSystem.makeAbsolutePath(path6).split("/").length - 1;
      options.recursively = options.recursively == false && options.maxDepth == 1 ? false : options.recursively;
      if (options.maxDepthFromRoot == null) {
        options.maxDepthFromRoot = Infinity;
      }
      if (options.maxDepth != Infinity && options.maxDepth != null) {
        options.maxDepthFromRoot = startingDepth + options.maxDepth;
      }
      options.maxDepth = null;
      if (startingDepth < options.maxDepthFromRoot) {
        if (!options.recursively) {
          if (info.isFolder) {
            if (!options.shouldntInclude) {
              for (const each2 of Deno.readDirSync(path6)) {
                if (options.dontReturnSymlinks && each2.isSymlink) {
                  continue;
                }
                yield join4(path6, each2.name);
              }
            } else {
              const shouldntInclude = options.shouldntInclude;
              for (const each2 of Deno.readDirSync(path6)) {
                const eachPath2 = join4(path6, each2.name);
                if (options.dontReturnSymlinks && each2.isSymlink) {
                  continue;
                }
                const shouldntIncludeThis = shouldntInclude && shouldntInclude(eachPath2);
                if (!shouldntIncludeThis) {
                  yield eachPath2;
                }
              }
            }
          }
        } else {
          options = { exclude: /* @__PURE__ */ new Set(), searchOrder: "breadthFirstSearch", maxDepth: Infinity, ...options };
          options.searchOrder = options.searchOrder || "breadthFirstSearch";
          const { shouldntExplore, shouldntInclude } = options;
          if (!["breadthFirstSearch", "depthFirstSearch"].includes(options.searchOrder)) {
            throw Error(`when calling FileSystem.sync.iterateItemsIn('${path6}', { searchOrder: ${options.searchOrder} })

    The searchOrder currently can only be 'depthFirstSearch' or 'breadthFirstSearch'
    However, it was not either of those: ${options.searchOrder}`);
          }
          const useBreadthFirstSearch = options.searchOrder == "breadthFirstSearch";
          const shouldntExploreThis = shouldntExplore && shouldntExplore(info.path, info);
          if (!shouldntExploreThis && info.isFolder) {
            options.exclude = options.exclude instanceof Set ? options.exclude : new Set(options.exclude);
            if (!options.exclude.has(path6)) {
              const followSymlinks = !options.dontFollowSymlinks;
              const absolutePathVersion = FileSystem.makeAbsolutePath(path6);
              options.exclude.add(absolutePathVersion);
              const searchAfterwords = [];
              for (const entry of Deno.readDirSync(path6)) {
                const eachPath2 = join4(path6, entry.name);
                if (options.dontReturnSymlinks && each.isSymlink) {
                  continue;
                }
                const shouldntIncludeThis = shouldntInclude && shouldntInclude(eachPath2);
                if (!shouldntIncludeThis) {
                  yield eachPath2;
                }
                const isNormalFileHardlink = entry.isFile;
                const isWeirdItem = !entry.isDirectory && !isNormalFileHardlink && !entry.isSymlink;
                if (isNormalFileHardlink || isWeirdItem) {
                  continue;
                }
                if (followSymlinks && !entry.isDirectory) {
                  let isSymlinkToDirectory = false;
                  try {
                    isSymlinkToDirectory = Deno.statSync(eachPath2).isDirectory;
                  } catch (error) {
                  }
                  if (!isSymlinkToDirectory) {
                    continue;
                  }
                }
                if (useBreadthFirstSearch) {
                  searchAfterwords.push(eachPath2);
                } else {
                  for (const eachSubPath of FileSystem.sync.iteratePathsIn(eachPath2, options)) {
                    yield eachSubPath;
                  }
                }
              }
              options.recursively = false;
              while (searchAfterwords.length > 0) {
                const next = searchAfterwords.shift();
                for (const eachSubPath of FileSystem.sync.iteratePathsIn(next, options)) {
                  yield eachSubPath;
                  searchAfterwords.push(eachSubPath);
                }
              }
            }
          }
        }
      }
    },
    listPathsIn(pathOrFileInfo, options) {
      return [...FileSystem.sync.iteratePathsIn(pathOrFileInfo, options)];
    },
    *iterateItemsIn(pathOrFileInfo, options = { recursively: false, shouldntInclude: null, shouldntExplore: null, searchOrder: "breadthFirstSearch", maxDepth: Infinity }) {
      options = { exclude: /* @__PURE__ */ new Set(), searchOrder: "breadthFirstSearch", maxDepth: Infinity, ...options };
      options.searchOrder = options.searchOrder || "breadthFirstSearch";
      options.recursively = options.recursively == false && options.maxDepth == 1 ? false : options.recursively;
      const { shouldntExplore, shouldntInclude } = options;
      const info = pathOrFileInfo instanceof Path ? pathOrFileInfo : FileSystem.sync.info(pathOrFileInfo);
      const path6 = info.path;
      if (!["breadthFirstSearch", "depthFirstSearch"].includes(options.searchOrder)) {
        throw Error(`when calling FileSystem.iterateItemsIn('${path6}', { searchOrder: ${options.searchOrder} })

    The searchOrder currently can only be 'depthFirstSearch' or 'breadthFirstSearch'
    However, it was not either of those: ${options.searchOrder}`);
      }
      const useBreadthFirstSearch = options.searchOrder == "breadthFirstSearch";
      const shouldntExploreThis = shouldntExplore && shouldntExplore(info);
      if (!shouldntExploreThis && options.maxDepth > 0 && info.isFolder) {
        options.exclude = options.exclude instanceof Set ? options.exclude : new Set(options.exclude);
        if (!options.exclude.has(path6)) {
          const absolutePathVersion = FileSystem.makeAbsolutePath(path6);
          options.exclude.add(absolutePathVersion);
          options.maxDepth -= 1;
          const searchAfterwords = [];
          for (const entry of Deno.readDirSync(path6)) {
            const eachItem = FileSystem.sync.info(join4(path6, entry.name));
            const shouldntIncludeThis = shouldntInclude && shouldntInclude(eachItem);
            if (!shouldntIncludeThis) {
              yield eachItem;
            }
            if (options.recursively) {
              if (eachItem.isFolder) {
                if (useBreadthFirstSearch) {
                  searchAfterwords.push(eachItem);
                } else {
                  for (const eachSubPath of FileSystem.sync.iterateItemsIn(eachItem, options)) {
                    yield eachSubPath;
                  }
                }
              }
            }
          }
          options.recursively = false;
          while (searchAfterwords.length > 0) {
            const next = searchAfterwords.shift();
            for (const eachSubItem of FileSystem.sync.iterateItemsIn(next, options)) {
              yield eachSubItem;
              if (eachSubItem.isFolder) {
                searchAfterwords.push(eachSubItem);
              }
            }
          }
        }
      }
    },
    listItemsIn(pathOrFileInfo, options) {
      const output2 = [];
      for (const eachPath2 of FileSystem.sync.iteratePathsIn(pathOrFileInfo, options)) {
        output2.push(FileSystem.sync.info(eachPath2));
      }
      return output2;
    },
    // includes symlinks if they link to files and pipes
    listFileItemsIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
      const { treatAllSymlinksAsFiles } = { treatAllSymlinksAsFiles: false, ...options };
      const items = FileSystem.sync.listItemsIn(pathOrFileInfo, options);
      if (treatAllSymlinksAsFiles) {
        return items.filter((eachItem) => eachItem.isFile || eachItem.isSymlink);
      } else {
        return items.filter((eachItem) => eachItem.isFile);
      }
    },
    listFilePathsIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
      return FileSystem.sync.listFileItemsIn(pathOrFileInfo, options).map((each2) => each2.path);
    },
    listFileBasenamesIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
      return FileSystem.sync.listFileItemsIn(pathOrFileInfo, options).map((each2) => each2.basename);
    },
    listFolderItemsIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
      const { ignoreSymlinks } = { ignoreSymlinks: false, ...options };
      const items = FileSystem.sync.listItemsIn(pathOrFileInfo, options);
      if (ignoreSymlinks) {
        return items.filter((eachItem) => eachItem.isFolder && !eachItem.isSymlink);
      } else {
        return items.filter((eachItem) => eachItem.isFolder);
      }
    },
    listFolderPathsIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
      return FileSystem.sync.listFolderItemsIn(pathOrFileInfo, options).map((each2) => each2.path);
    },
    listFolderBasenamesIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
      return FileSystem.sync.listFolderItemsIn(pathOrFileInfo, options).map((each2) => each2.basename);
    },
    recursivelyIterateItemsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
      options.recursively = true;
      if (options.onlyHardlinks) {
        if (options.shouldntInclude) {
          const originalshouldntInclude = options.shouldntInclude;
          options.shouldntInclude = (each2) => each2.isSymlink || originalshouldntInclude(each2);
        } else {
          options.shouldntInclude = (each2) => each2.isSymlink;
        }
      }
      if (options.dontFollowSymlinks) {
        if (options.shouldntExplore) {
          const originalShouldntExplore = options.shouldntInclude;
          options.shouldntExplore = (each2) => each2.isSymlink || originalShouldntExplore(each2);
        } else {
          options.shouldntExplore = (each2) => each2.isSymlink;
        }
      }
      return FileSystem.sync.iterateItemsIn(pathOrFileInfo, options);
    },
    recursivelyIteratePathsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
      options.recursively = true;
      if (options.onlyHardlinks) {
        if (options.shouldntInclude) {
          const originalshouldntInclude = options.shouldntInclude;
          options.shouldntInclude = (each2) => each2.isSymlink || originalshouldntInclude(each2);
        } else {
          options.shouldntInclude = (each2) => each2.isSymlink;
        }
      }
      return FileSystem.sync.iteratePathsIn(pathOrFileInfo, options);
    },
    recursivelyListPathsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
      return [...FileSystem.sync.recursivelyIteratePathsIn(pathOrFileInfo, options)];
    },
    recursivelyListItemsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
      return [...FileSystem.sync.recursivelyIterateItemsIn(pathOrFileInfo, options)];
    }
    // sync TODO:
    // globIterator
    // getPermissions
    // addPermissions
    // Note:
    // cannot be sync:
    // walkUpImport 
  }
};
var glob = FileSystem.glob;

// https://deno.land/x/good@1.7.1.0/flattened/word_list.js
var wordList = (str) => {
  const addedSeperator = str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/[^a-zA-Z0-9 _.-]/, "_").toLowerCase();
  const words = addedSeperator.split(/[ _.-]+/g).filter((each2) => each2);
  return words;
};

// https://deno.land/x/good@1.7.1.0/flattened/to_camel_case.js
var toCamelCase = (str) => {
  const words = wordList(str);
  const capatalizedWords = words.map((each2) => each2.replace(/^\w/, (group0) => group0.toUpperCase()));
  capatalizedWords[0] = capatalizedWords[0].toLowerCase();
  return capatalizedWords.join("");
};

// https://deno.land/x/good@1.7.1.0/flattened/parse_args.js
var flag = Symbol("flagArg");
var required = Symbol("requiredArg");
var unset = Symbol("unset");
var Default = class {
  constructor(val) {
    this.val = val;
  }
};
var initialValue = (value) => new Default(value);
var coerseValue = (value, transformer) => {
  if (value instanceof Array) {
    try {
      return transformer(value);
    } catch (error) {
      const newValues = [];
      for (const each2 of value) {
        try {
          newValues.push(transformer(each2));
        } catch (error2) {
          newValues.push(each2);
        }
      }
      return newValues;
    }
  } else if (value !== void 0 && value !== unset) {
    try {
      return transformer(value);
    } catch (error) {
    }
  }
  return value;
};
function parseArgs({
  rawArgs,
  fields,
  namedArgsStopper = "--",
  allowNameRepeats = true,
  nameTransformer = toCamelCase,
  valueTransformer = JSON.parse,
  isolateArgsAfterStopper = false,
  argsByNameSatisfiesNumberedArg = true,
  implicitNamePattern = /^(--|-)[a-zA-Z0-9\-_]+$/,
  implictFlagPattern = null
}) {
  const explicitNamesList = [];
  const explicitFlagList = [];
  const keyToField = /* @__PURE__ */ new Map();
  for (const [keys, ...kind] of fields) {
    const isFlag = kind.includes(flag);
    const isRequired = kind.includes(required);
    const hasDefaultValue = kind.some((each2) => each2 instanceof Default);
    const hasTransformer = kind.some((each2) => each2 instanceof Function);
    const entry = {
      isRequired,
      isFlag,
      isExplicit: true,
      hasTransformer,
      wasNamed: false,
      keys,
      kind,
      realIndices: [],
      value: unset,
      hasDefaultValue,
      default: hasDefaultValue ? kind.filter((each2) => each2 instanceof Default)[0].val : void 0
    };
    for (const each2 of keys) {
      if (keyToField.has(each2)) {
        throw Error(`When calling parseArgs(), there's at least two arguments that are both trying to use this name ${JSON.stringify(each2)}. A name can only belong to one argument.`);
      }
      keyToField.set(each2, entry);
      if (typeof each2 == "string") {
        explicitNamesList.push(each2);
      }
    }
    if (isFlag) {
      for (const each2 of keys) {
        if (typeof each2 == "string") {
          explicitFlagList.push(each2);
        }
      }
    }
  }
  const argsAfterStopper = [];
  const numberWasImplicit = [];
  const nameWasImplicit = [];
  let directArgList = [];
  const argsByNumber = {};
  let stopParsingArgsByName = false;
  let argName = null;
  let runningArgNumberIndex = -1;
  let index = -1;
  let nameStopIndex = null;
  const numberedArgBuffer = [];
  const handleNumberedArg = (index2, each2) => {
    directArgList.push(each2);
    parse_next_numbered_arg: while (1) {
      runningArgNumberIndex += 1;
      if (!keyToField.has(runningArgNumberIndex)) {
        numberWasImplicit.push(runningArgNumberIndex);
        keyToField.set(runningArgNumberIndex, {
          kind: [],
          keys: [runningArgNumberIndex],
          realIndices: [index2],
          value: each2
        });
      } else {
        const entry = keyToField.get(runningArgNumberIndex);
        if (entry.value != unset) {
          if (argsByNameSatisfiesNumberedArg) {
            continue parse_next_numbered_arg;
          } else if (allowNameRepeats) {
            entry.value = [entry.value, each2];
          } else {
            throw Error(`When calling parseArgs(), two values were given for the same entry (ex: "count $thisVal 5 --min $thisVal" instead of "count --min $thisVal --max 5" or "count $thisVal 5"). The second occurance was ${argName}, and the field was ${JSON.stringify(entry.names)}`);
          }
        } else {
          argsByNumber[runningArgNumberIndex] = each2;
          entry.value = each2;
        }
        entry.realIndices.push(index2);
      }
      break;
    }
  };
  for (const eachArg of rawArgs) {
    index += 1;
    if (argName != null) {
      const name = argName;
      argName = null;
      if (!keyToField.has(name)) {
        nameWasImplicit.push(name);
        keyToField.set(name, {
          wasNamed: true,
          kind: [],
          keys: [name],
          realIndices: [index],
          value: eachArg
        });
      } else {
        const entry = keyToField.get(name);
        entry.wasNamed = true;
        if (entry.value !== unset) {
          if (allowNameRepeats) {
            entry.value = [entry.value, eachArg];
          } else {
            throw Error(`When calling parseArgs(), two values (ex: "--min 5 --minimum 5" or "--m 5 --m 5") were given to the same field. The second occurance was ${name}, and the field was ${JSON.stringify(entry.keys)} `);
          }
        } else {
          entry.value = eachArg;
        }
        entry.realIndices.push(index - 1);
        entry.realIndices.push(index);
      }
      continue;
    }
    if (eachArg == namedArgsStopper) {
      stopParsingArgsByName = true;
      nameStopIndex = index;
      continue;
    }
    if (stopParsingArgsByName) {
      argsAfterStopper.push(eachArg);
      if (!isolateArgsAfterStopper) {
        numberedArgBuffer.push([index, eachArg]);
      }
      continue;
    }
    let match;
    if (explicitFlagList.includes(eachArg)) {
      const entry = keyToField.get(eachArg);
      if (entry.value != unset) {
        if (!allowNameRepeats) {
          throw Error(`When calling parseArgs(), two values (ex: "--min 5 --minimum 5" or "--m 5 --m 5") were given to the same field. The second occurance was ${eachArg}, and the field was ${JSON.stringify(entry.keys)} `);
        }
      } else {
        entry.value = true;
      }
      entry.realIndices.push(index);
    } else if (explicitNamesList.includes(eachArg)) {
      argName = eachArg;
    } else if (implicitNamePattern && (match = eachArg.match(implicitNamePattern))) {
      argName = eachArg;
    } else if (implictFlagPattern && (match = eachArg.match(implictFlagPattern))) {
      if (!keyToField.has(eachArg)) {
        keyToField.set(runningArgNumberIndex, {
          isFlag: true,
          kind: [],
          keys: [eachArg],
          realIndices: [index],
          value: true
        });
      } else {
        keyToField.get(eachArg).realIndices.push(index);
      }
    } else {
      numberedArgBuffer.push([index, eachArg]);
    }
  }
  for (const [index2, each2] of numberedArgBuffer) {
    handleNumberedArg(index2, each2);
  }
  const simplifiedNames = {};
  const argsByName = {};
  const fieldSet = new Set(keyToField.values());
  for (const eachEntry of fieldSet) {
    const names = eachEntry.keys.filter((each2) => typeof each2 == "string");
    if (names.length > 0) {
      if (!nameTransformer) {
        simplifiedNames[names[0]] = null;
      } else {
        const transformedNames = names.map(nameTransformer).flat(1);
        simplifiedNames[transformedNames[0]] = null;
        const newNames = transformedNames.filter((each2) => !names.includes(each2));
        eachEntry.keys = eachEntry.keys.concat(newNames);
        for (const newName of newNames) {
          keyToField.set(newName, eachEntry);
        }
      }
    }
  }
  for (const eachEntry of fieldSet) {
    if (eachEntry.isRequired && eachEntry.value == unset) {
      throw Error(`

The ${eachEntry.keys.map((each2) => typeof each2 == "number" ? `[Arg #${each2}]` : each2).join(" ")} field is required but it was not provided
`);
    }
    const usingDefaultValue = eachEntry.hasDefaultValue && eachEntry.value == unset;
    if (usingDefaultValue) {
      eachEntry.value = eachEntry.default;
    } else {
      if (eachEntry.hasTransformer) {
        for (const eachTransformer of eachEntry.kind) {
          if (eachTransformer instanceof Function) {
            eachEntry.value = eachTransformer(eachEntry.value);
          }
        }
      } else if (valueTransformer && !eachEntry.isFlag) {
        eachEntry.value = coerseValue(eachEntry.value, valueTransformer);
      }
    }
    if (eachEntry.isFlag) {
      if (eachEntry.value == unset) {
        eachEntry.value = false;
      } else {
        eachEntry.value = !!eachEntry.value;
      }
    }
    for (const eachName of eachEntry.keys) {
      if (typeof eachName == "number") {
        argsByNumber[eachName] = eachEntry.value;
      } else if (typeof eachName == "string") {
        argsByName[eachName] = eachEntry.value;
      }
    }
  }
  const implicitArgsByName = {};
  const implicitArgsByNumber = [];
  for (const { isExplicit, value, keys } of fieldSet) {
    if (!isExplicit) {
      if (typeof keys[0] == "number") {
        implicitArgsByNumber.push(value);
      } else {
        implicitArgsByName[keys[0]] = value;
        implicitArgsByName[nameTransformer(keys[0])] = value;
      }
    }
  }
  const explicitArgsByName = {};
  const explicitArgsByNumber = [];
  for (const { isExplicit, kind, value, keys } of fieldSet) {
    if (isExplicit) {
      for (const eachKey of keys) {
        if (typeof eachKey == "number") {
          explicitArgsByNumber[eachKey] = value;
        } else {
          explicitArgsByName[eachKey] = value;
        }
      }
    }
  }
  for (const each2 of Object.keys(simplifiedNames)) {
    simplifiedNames[each2] = argsByName[each2];
  }
  if (valueTransformer) {
    directArgList = directArgList.map((each2) => coerseValue(each2, valueTransformer));
  }
  return {
    simplifiedNames,
    argList: explicitArgsByNumber.concat(implicitArgsByNumber),
    explicitArgsByNumber,
    implicitArgsByNumber,
    directArgList,
    argsAfterStopper,
    arg: (nameOrIndex) => {
      if (typeof nameOrIndex == "number") {
        return argsByNumber[nameOrIndex];
      } else {
        return argsByName[nameOrIndex];
      }
    },
    fields: [...fieldSet],
    field: keyToField.get,
    explicitArgsByName,
    implicitArgsByName,
    nameStopIndex
  };
}

// https://deno.land/x/good@1.7.1.0/flattened/levenshtein_distance_between.js
function levenshteinDistanceBetween(str1, str2) {
  if (str1.length > str2.length) {
    ;
    [str1, str2] = [str2, str1];
  }
  let distances = Array.from({ length: str1.length + 1 }, (_3, i3) => +i3);
  for (let str2Index = 0; str2Index < str2.length; str2Index++) {
    const tempDistances = [str2Index + 1];
    for (let str1Index = 0; str1Index < str1.length; str1Index++) {
      let char1 = str1[str1Index];
      let char2 = str2[str2Index];
      if (char1 === char2) {
        tempDistances.push(distances[str1Index]);
      } else {
        tempDistances.push(1 + Math.min(distances[str1Index], distances[str1Index + 1], tempDistances[tempDistances.length - 1]));
      }
    }
    distances = tempDistances;
  }
  return distances[distances.length - 1];
}

// https://deno.land/x/good@1.7.1.0/flattened/did_you_mean.js
function didYouMean(arg) {
  var { givenWord, givenWords, possibleWords, caseSensitive, autoThrow, suggestionLimit } = { suggestionLimit: Infinity, ...arg };
  if (givenWords instanceof Array) {
    let output2 = {};
    for (const givenWord2 of givenWords) {
      output2[givenWord2] = didYouMean({ ...arg, givenWord: givenWord2, givenWords: void 0 });
    }
    return output2;
  }
  if (!caseSensitive) {
    possibleWords = possibleWords.map((each2) => each2.toLowerCase());
    givenWord = givenWord.toLowerCase();
  }
  if (!possibleWords.includes(givenWord) && autoThrow) {
    let suggestions = didYouMean({
      givenWord,
      possibleWords,
      caseSensitive,
      suggestionLimit
    });
    if (suggestionLimit == 1 && suggestions.length > 0) {
      throw new Error(`For ${JSON.stringify(givenWord)}, did you mean ${JSON.stringify(suggestions[0])}?`);
    } else {
      throw new Error(`For ${JSON.stringify(givenWord)}, did you mean one of ${JSON.stringify(suggestions)}?`);
    }
  }
  return [...possibleWords].sort((a5, b5) => levenshteinDistanceBetween(givenWord, a5) - levenshteinDistanceBetween(givenWord, b5)).slice(0, suggestionLimit);
}

// https://deno.land/x/good@1.7.1.1/flattened/path_pieces.js
function pathPieces(path6) {
  path6 = path6.path || path6;
  const result = parse3(path6);
  const folderList = [];
  let dirname7 = result.dir;
  while (true) {
    folderList.push(basename3(dirname7));
    if (dirname7 == dirname3(dirname7)) {
      break;
    }
    dirname7 = dirname3(dirname7);
  }
  folderList.reverse();
  return [folderList, result.name, result.ext];
}

// main/4_inlined.js
var inlined_default = ({ denoVersion: denoVersion2, argsForUnix, argsForWindows, disableUrlRun: disableUrlRun2 = false }) => `#!/usr/bin/env sh
"\\"",\`$(echo --% ' |out-null)" >$null;function :{};function getDenoVersion{<#\${/*'>/dev/null )\` 2>/dev/null;getDenoVersion() { #>
echo "${denoVersion2}"; : --% ' |out-null <#'; }; deno_version="$(getDenoVersion)"; deno="$HOME/.deno/$deno_version/bin/deno"; target_script="$0"; disable_url_run="${disableUrlRun2 ? "1" : ""}";  if [ -n "$_u" ] && [ -z "$disable_url_run" ]; then target_script="$_u"; fi; if [ -x "$deno" ];then  exec "$deno" run ${argsForUnix} "$target_script" "$@";  elif [ -f "$deno" ]; then  chmod +x "$deno" && exec "$deno" run ${argsForUnix} "$target_script" "$@"; fi; has () { command -v "$1" >/dev/null; };  set -e;  if ! has unzip && ! has 7z; then echo "Can I try to install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" =~ ^[Yy] ]; then  if ! has brew; then  brew install unzip; elif has apt-get; then if [ "$(whoami)" = "root" ]; then  apt-get install unzip -y; elif has sudo; then  echo "I'm going to try sudo apt install unzip";read ANSWER;echo;  sudo apt-get install unzip -y;  elif has doas; then  echo "I'm going to try doas apt install unzip";read ANSWER;echo;  doas apt-get install unzip -y;  else apt-get install unzip -y;  fi;  fi;  fi;   if ! has unzip; then  echo ""; echo "So I couldn't find an 'unzip' command"; echo "And I tried to auto install it, but it seems that failed"; echo "(This script needs unzip and either curl or wget)"; echo "Please install the unzip command manually then re-run this script"; exit 1;  fi;  fi;   if ! has unzip && ! has 7z; then echo "Error: either unzip or 7z is required to install Deno (see: https://github.com/denoland/deno_install#either-unzip-or-7z-is-required )." 1>&2; exit 1; fi;  if [ "$OS" = "Windows_NT" ]; then target="x86_64-pc-windows-msvc"; else case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; "Linux aarch64") target="aarch64-unknown-linux-gnu" ;; *) target="x86_64-unknown-linux-gnu" ;; esac fi;  print_help_and_exit() { echo "Setup script for installing deno  Options: -y, --yes Skip interactive prompts and accept defaults --no-modify-path Don't add deno to the PATH environment variable -h, --help Print help " echo "Note: Deno was not installed"; exit 0; };  for arg in "$@"; do case "$arg" in "-h") print_help_and_exit ;; "--help") print_help_and_exit ;; "-"*) ;; *) if [ -z "$deno_version" ]; then deno_version="$arg"; fi ;; esac done; if [ -z "$deno_version" ]; then deno_version="$(curl -s https://dl.deno.land/release-latest.txt)"; fi;  deno_uri="https://dl.deno.land/release/v\${deno_version}/deno-\${target}.zip"; deno_install="\${DENO_INSTALL:-$HOME/.deno/$deno_version}"; bin_dir="$deno_install/bin"; exe="$bin_dir/deno";  if [ ! -d "$bin_dir" ]; then mkdir -p "$bin_dir"; fi;  if has curl; then curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri"; elif has wget; then wget --output-document="$exe.zip" "$deno_uri"; else echo "Error: curl or wget is required to download Deno (see: https://github.com/denoland/deno_install )." 1>&2; fi;  if has unzip; then unzip -d "$bin_dir" -o "$exe.zip"; else 7z x -o"$bin_dir" -y "$exe.zip"; fi; chmod +x "$exe"; rm "$exe.zip";  exec "$deno" run ${argsForUnix} "$0" "$@";       #>}; $DenoInstall = "\${HOME}/.deno/$(getDenoVersion)"; $BinDir = "$DenoInstall/bin"; $DenoExe = "$BinDir/deno.exe"; $TargetScript = "$PSCommandPath"; $DisableUrlRun = "${disableUrlRun2 ? "1" : ""}";  if ($Env:_u -and $DisableUrlRun) { $TargetScript = "$Env:_u"; };  if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir/deno.zip"; $DenoUri = "https://github.com/denoland/deno/releases/download/v$(getDenoVersion)/deno-x86_64-pc-windows-msvc.zip";  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;  if (!(Test-Path $BinDir)) { New-Item $BinDir -ItemType Directory | Out-Null; };  Function Test-CommandExists { Param ($command); $oldPreference = $ErrorActionPreference; $ErrorActionPreference = "stop"; try {if(Get-Command "$command"){RETURN $true}} Catch {Write-Host "$command does not exist"; RETURN $false}; Finally {$ErrorActionPreference=$oldPreference}; };  if (Test-CommandExists curl) { curl -Lo $DenoZip $DenoUri; } else { curl.exe -Lo $DenoZip $DenoUri; };  if (Test-CommandExists curl) { tar xf $DenoZip -C $BinDir; } else { tar -Lo $DenoZip $DenoUri; };  Remove-Item $DenoZip;   }; & "$DenoExe" run ${argsForWindows} "$TargetScript" @args; Exit $LastExitCode; <# 
# */0}\`;
`;

// main/universify-api.js
var specialCharPattern = /\s|\\|\"|'|`|#|\$|%|&|;|\*|\(|\)|\[|\]|\{|\}|,|<|>|\?|@|\^|\||~/;
var shellEscape = (arg) => `'${arg.replace(/'/g, `'"'"'`)}'`;
function enhanceScript({ filePath, jsFileContent, denoVersion: denoVersion2, additionalArgs: additionalArgs2, additionalArgsForUnix: additionalArgsForUnix2, additionalArgsForWindows: additionalArgsForWindows2, baseArgs = ["-q", "-A", "--no-lock", "--no-config"], disableUrlRun: disableUrlRun2 = false, noPs1: noPs12 = false }) {
  const nonStringArgs = Object.entries({ filePath, jsFileContent, denoVersion: denoVersion2 }).filter(
    ([name, arg]) => typeof arg != "string"
  ).map(
    ([name, arg]) => name
  );
  if (nonStringArgs.length > 0) {
    throw new Error(`

For Universify, I got arguments ${JSON.stringify(nonStringArgs)} that needed to be strings but were not`);
  }
  for (const each2 of [...additionalArgs2, ...baseArgs]) {
    let match = each2.match(specialCharPattern);
    if (match) {
      throw new Error(`

For Universify, I got a CLI argument for the script that contains a special character: ${match[0]}
This is a problem because the character behaves differently on windows/non-windows.

However, you can still add the argument. You'll simply need to specify both the --additionalArgsForUnix and --additionalArgsForWindows individually.

NOTE! On unix/not-windows, args will be be passed as strings. But on windows, the arguments are passed as-is to powershell (AKA they are evaled as code). %THING for windows would expand the THING variable, while on unix it would simply be the string "%THING". 
This is because its impossible to reliably/generically escape arguments on windows.`);
    }
  }
  let filePathNameNoExt = basename3(filePath);
  if (filePathNameNoExt.includes(".")) {
    filePathNameNoExt = filePathNameNoExt.split(".").slice(0, -1).join(".");
  }
  const [folders, itemName, itemExtensionWithDot] = pathPieces(filePath);
  const normalPath2 = `${folders.join("/")}/${itemName}`;
  let ps1Path2;
  if (noPs12) {
    ps1Path2 = `${folders.join("/")}/${itemName}`;
  } else {
    ps1Path2 = `${folders.join("/")}/${itemName}.ps1`;
  }
  const denoVersionList = denoVersion2.split(".").map((each2) => each2 - 0);
  const [major, minor, patch, ...rest] = denoVersionList;
  const supportsNoLock = major > 1 || major == 1 && (minor > 27 || minor == 27 && patch > 1);
  const supportsNoConfig = major > 1 || (major == 1 || minor > 21);
  if (!supportsNoLock) {
    baseArgs = baseArgs.filter((each2) => each2 != "--no-lock");
  }
  if (!supportsNoConfig) {
    baseArgs = baseArgs.filter((each2) => each2 != "--no-config");
  }
  const argsForUnix = [...baseArgs, ...additionalArgs2.map(shellEscape), ...additionalArgsForUnix2.map(shellEscape)].join(" ");
  const argsForWindows = [...baseArgs, ...additionalArgs2, ...additionalArgsForWindows2].join(" ");
  const newHeader = inlined_default({ denoVersion: denoVersion2, argsForUnix, argsForWindows, disableUrlRun: disableUrlRun2 });
  let newContents2 = jsFileContent;
  newContents2 = newContents2.replace(/\n\/\/ \(this comment is part of universify, dont remove\) #>/g, "");
  newContents2 = newContents2.replace(/^#!\/usr\/bin\/env -S deno.+\n/, "");
  newContents2 = newContents2.replace(/#!\/usr\/bin\/env sh(\w|\W)+?\n# *\*\/0\}`;\n/, "");
  newContents2 = newContents2.replace(/#>/g, "#\\>");
  newContents2 = newHeader + newContents2 + "\n// (this comment is part of universify, dont remove) #>";
  return {
    symlinkPath: `./${filePathNameNoExt}.ps1`,
    normalPath: normalPath2,
    ps1Path: ps1Path2,
    newContents: newContents2
  };
}

// main/version.js
var version2 = "1.0.0.7";

// main/universify.js
var { help: showHelp, version: showVersion } = parseArgs({
  rawArgs: Deno.args,
  fields: [
    [["--help"], flag],
    [["--version"], flag]
  ]
}).simplifiedNames;
if (showVersion) {
  console.log(version2);
  Deno.exit(0);
}
if (showHelp) {
  console.log(`
    Universify
        examples:
            universify ./your_file.js
            universify ./your_file.js ${Deno.version.deno}
            universify ./your_file.js --deno-version ${Deno.version.deno}
            universify --version
            universify --file ./your_file.js
            universify --file ./your_file.js --deno-version ${Deno.version.deno}
            universify --file ./your_file.js --disable-url-run
            universify --file ./your_file.js --single-file
            universify --file ./your_file.js --no-ps1
            universify --file ./your_file.js \\
                --add-arg '--no-npm' \\
                --add-arg '--unstable'
            
            universify --file ./your_file.js \\
                --add-unix-arg '--unstable-ffi' \\
                --add-windows-arg '--unstable-cron'
            
            universify --file ./your_file.js \\
                --no-default-args \\
                --add-arg '--quiet' \\
                --add-arg '--allow-read'
        `);
  Deno.exit(0);
}
var output = parseArgs({
  rawArgs: Deno.args,
  fields: [
    [[0, "--file"], required],
    [[1, "--deno-version"], initialValue(`${Deno.version.deno}`)],
    [["--no-default-args"], flag],
    [["--disable-url-run"], flag],
    [["--single-file"], flag],
    [["--no-ps1"], flag],
    [["--add-arg"], initialValue([])],
    [["--add-unix-arg"], initialValue([])],
    [["--add-windows-arg"], initialValue([])]
  ],
  nameTransformer: toCamelCase,
  namedArgsStopper: "--",
  allowNameRepeats: true,
  valueTransformer: JSON.parse,
  isolateArgsAfterStopper: false,
  argsByNameSatisfiesNumberedArg: true,
  implicitNamePattern: /^(--|-)[a-zA-Z0-9\-_]+$/,
  implictFlagPattern: null
});
didYouMean({
  givenWords: Object.keys(output.implicitArgsByName).filter((each2) => each2.startsWith(`-`)),
  possibleWords: Object.keys(output.explicitArgsByName).filter((each2) => each2.startsWith(`-`)),
  autoThrow: true
});
var {
  file: path5,
  denoVersion,
  addArg: additionalArgs,
  addUnixArg: additionalArgsForUnix,
  addWindowsArg: additionalArgsForWindows,
  noDefaultArgs,
  disableUrlRun,
  singleFile,
  noPs1
} = output.simplifiedNames;
var fileDoenstExist = await Deno.lstat(path5).catch(() => ({ doesntExist: true })).doesntExist;
if (fileDoenstExist) {
  console.log(`Hey! the file you gave me doesn't seem to exist: ${path5}`);
  Deno.exit(1);
}
var contents = Deno.readTextFileSync(path5);
if (noPs1) {
  singleFile = true;
}
var { newContents, symlinkPath, normalPath, ps1Path } = enhanceScript({
  filePath: path5,
  jsFileContent: contents,
  denoVersion,
  additionalArgs: typeof additionalArgs === "string" ? [additionalArgs] : additionalArgs,
  additionalArgsForUnix: typeof additionalArgsForUnix === "string" ? [additionalArgsForUnix] : additionalArgsForUnix,
  additionalArgsForWindows: typeof additionalArgsForWindows === "string" ? [additionalArgsForWindows] : additionalArgsForWindows,
  baseArgs: noDefaultArgs ? [] : ["-q", "-A", "--no-lock", "--no-config"],
  // NOTE: no lock is given because differnt versions of deno can have different lock file formats
  //       meaning the script will fail to run with the spcified version of deno
  //       if another version of deno is installed
  disableUrlRun,
  noPs1
});
console.log(`Creating ${ps1Path}`);
await FileSystem.write({
  data: newContents,
  path: ps1Path,
  overwrite: true
});
console.log(`Setting ${ps1Path} permissions`);
try {
  await FileSystem.addPermissions({
    path: ps1Path,
    permissions: {
      owner: {
        canExecute: true
      },
      group: {
        canExecute: true
      },
      others: {
        canExecute: true
      }
    }
  });
} catch (error) {
  if (Deno.build.os != "windows") {
    console.warn(`I was unable to make this file an executable, just fyi: ${ps1Path}`);
  }
}
if (!singleFile) {
  console.log(`Creating ${normalPath}`);
  FileSystem.sync.remove(normalPath);
  Deno.symlinkSync(
    symlinkPath,
    normalPath,
    {
      type: "file"
    }
  );
  console.log(`Setting ${normalPath} permissions`);
  try {
    await FileSystem.addPermissions({
      path: normalPath,
      permissions: {
        owner: {
          canExecute: true
        },
        group: {
          canExecute: true
        },
        others: {
          canExecute: true
        }
      }
    });
  } catch (error) {
    if (Deno.build.os != "windows") {
      console.warn(`I was unable to make this file an executable, just fyi: ${normalPath}`);
    }
  }
}
console.log(`

Done! ✅

`);
if (disableUrlRun) {
  console.log(`Run locally with:`);
  const parentFolder = FileSystem.makeRelativePath({ from: FileSystem.pwd, to: FileSystem.dirname(normalPath) });
  console.log(yellow`    cd ${parentFolder}`);
  console.log(yellow(`    ./${FileSystem.basename(normalPath)}`.replace(/^    \.\/\.\//, "    ./")));
} else {
  console.log(`Run locally with:`);
  const parentFolder = FileSystem.makeRelativePath({ from: FileSystem.pwd, to: FileSystem.dirname(normalPath) });
  console.log(yellow`    cd ${parentFolder}`);
  console.log(yellow(`    ./${FileSystem.basename(normalPath)}`.replace(/^    \.\/\.\//, "    ./")));
  console.log(`
Run from anywhere with:`);
  console.log(yellow`    function u { echo URL_TO_THAT_FILE; };$Env:_u=$(u) || export _u=$(u); irm "$(u)"|iex || curl -fsSL "$_u" | sh`);
  try {
    const gitParentFolderOrNull = await FileSystem.walkUpUntil(".git/config");
    if (gitParentFolderOrNull) {
      const gitParentFolder = gitParentFolderOrNull;
      const gitBranchOrTagOrCommitHash = (await FileSystem.read(`${gitParentFolder}/.git/HEAD`)).trim().replace(/^(ref: )?/, "");
      const configString = await FileSystem.read(`${gitParentFolder}/.git/config`);
      let originUrlProbably;
      for (let each2 of configString.split(/\n/g)) {
        if (each2.match(/^\s*url = /)) {
          originUrlProbably = each2.split("=")[1].trim();
          break;
        }
      }
      let match, githubUsername, repoName;
      if (match = originUrlProbably.match(/^git@github\.com:([^\/]+)\/([^\/]+)\.git$/)) {
        githubUsername = match[1];
        repoName = match[2];
      } else if (match = originUrlProbably.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\.git)?$/)) {
        githubUsername = match[1];
        repoName = match[2];
      }
      if (githubUsername && repoName) {
        const relativePath = FileSystem.makeRelativePath({ from: gitParentFolderOrNull, to: ps1Path });
        console.log(``);
        console.log(dim`    If you're using github your one-liner will look like this:`);
        const url = `https://raw.githubusercontent.com/${githubUsername}/${repoName}/${gitBranchOrTagOrCommitHash}/${relativePath}`;
        console.log(yellow.dim`    function u { echo '${url}'; };$Env:_u=$(u) || export _u=$(u); irm "$(u)"|iex || curl -fsSL "$_u" | sh`);
      }
    }
  } catch (error) {
    console.log(dim`    If your script is part of a github repo, the url will follow this format:`);
    console.log(dim`    https://raw.githubusercontent.com/GITHUB_USERNAME/REPO_NAME/BRANCH_NAME_TAG_NAME_OR_COMMIT_HASH/PATH_TO_THIS_SCRIPT`);
  }
  console.log(``);
  console.log(`   NOTE1: if you are NOT using the run-from-url`);
  console.log(`          please disable by rerunning with the --disable-url-run flag`);
  console.log(`   NOTE2: when running from a url unfortunately`);
  console.log(`          there is no practical way to pass arguments`);
}
