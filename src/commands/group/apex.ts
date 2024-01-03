import { Args, Command, Flags, ux } from '@oclif/core';
import * as fs from 'fs';

export default class GroupApex extends Command {
  static description = 'Group all Apex Classes into one file'

  static examples = [
    '<%= config.bin %> <%= command.id %> --path "absolute/path/to/folder" --output "absolute/path/to/folder"',
  ]

  static flags = {
    pathToFolder: Flags.string({ char: 'p', description: 'absolute path to root folder of metadata' }),
    pathToOutputFile: Flags.string({ char: 'o', description: 'absolute path to folder when we store file' }),
  }

  static args = {
    //file: Args.string({description: 'file to read'}),
  }

  static files : object[] = [];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(GroupApex);

    if (!flags.pathToFolder) {
      this.error(`missed "-p" flag`);
    } else if (!flags.pathToOutputFile) {
      this.error(`missed "-o" flag`);
    }

    if(!fs.existsSync(flags.pathToFolder)) {
      this.error(`${flags.pathToFolder} is not a valid path`);
    } else if (!fs.existsSync(flags.pathToOutputFile)) {
      this.error(`${flags.pathToOutputFile} is not a valid path`);
    }

   this.buildSingleFile(flags);
  }

  async buildSingleFile(flags: object):Promise<void> {
    let pathToFolder = (flags as any).pathToFolder;
    let pathToOutputFile = (flags as any).pathToOutputFile;

    this.getAllFiles(pathToFolder);
    this.generateOneFile(pathToOutputFile);
  }

  async getAllFiles(pathToFolder: string):Promise<void> {
    fs.readdirSync(pathToFolder).forEach(item => {
      let itemPath = pathToFolder + '/' + item;

      if (fs.statSync(itemPath).isDirectory()) {
          return this.getAllFiles(itemPath);
      } else if (item.endsWith('.cls')) {
        GroupApex.files.push({
          name: item,
          path: itemPath
        });
      }
    });
  }

  async generateOneFile(pathToOutputFile:string):Promise<void> {
    let filesContent:string = GroupApex.files.reduce((total, file) => {
      let name = (file as any).name;
      let path = (file as any).path;

      let fileContent = fs.readFileSync(path, 'utf-8');
      
      total += `${name} \n ${fileContent} \n\n\n`;
      return total;
    }, '');

    let outputFile = `${pathToOutputFile}/apexClasses.txt`;
    if (fs.existsSync(outputFile)) {
      const overwrite = await ux.prompt('File already exist, overwride? (y/n)');

      if (overwrite !== 'y') return;
    }
    fs.writeFileSync(outputFile, filesContent);
  }
  
}
