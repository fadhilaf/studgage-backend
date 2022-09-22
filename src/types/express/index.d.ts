//ts-node jg idak auto detect file .d.ts nyo jugo, jadi harus dikasih 
//flag "--files" sumber: https://stackoverflow.com/a/61024331/13673444
//tapi karno kito pakek nodemon yang auto ngejalanin ts-node nih agak kacau hmm
//nodemon nyo biso di config pake "--exec" :v sumber: https://stackoverflow.com/a/37979548/13673444
import { ObjectId } from "bson";

//kito harus tambahin config di tsconfig.json jugo, di bagian rootDirs typeRoots
// https://stackoverflow.com/a/58788706/13673444
declare global { //declare global biar typenyo apply ke tiap file
  declare namespace Express {
      interface Request {
        user?: {
          id: ObjectId;
          username: string;
          picture: string;
        };
      }
  }
}
