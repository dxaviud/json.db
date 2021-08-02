import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

export default class FileSystemManager {
    constructor(rootPath) {
        this.rootPath = rootPath; // the absolute path to the project's directory for storing data
        try {
            fsSync.mkdirSync(rootPath, { recursive: false });
            console.log("Created directory " + rootPath);
        } catch {
            console.log("Directory " + rootPath + " already exists");
        }
        console.log(
            "Initialized file system manager with root path " + rootPath
        );
    }

    identifierToPath(identifier) {
        const split = identifier.split(".");
        split[split.length - 1] += ".json";
        const resultPath = path.join(this.rootPath, ...split);
        console.log(
            "Converted identifier " + identifier + " to path " + resultPath
        );
        return resultPath;
    }

    async has(identifier) {
        const filePath = this.identifierToPath(identifier);
        return await this.hasPath(filePath);
    }

    async hasPath(filePath) {
        try {
            await fs.open(filePath);
            console.log(filePath + " exists");
            return true;
        } catch {
            console.log(filePath + " does not exist");
            return false;
        }
    }

    async write(identifier, object) {
        const filePath = this.identifierToPath(identifier);
        await fs.writeFile(filePath, JSON.stringify(object));
        console.log("Wrote " + identifier + " to " + filePath);
    }

    async read(identifier) {
        const filePath = this.identifierToPath(identifier);
        console.log("Reading from " + filePath);
        if (this.hasPath(filePath)) {
            const jsonString = await fs.readFile(filePath, "utf8");
            console.log("Returning parsed JSON");
            return JSON.parse(jsonString);
        }
        console.log(filePath + " does not exist, returning null");
        return null;
    }
}