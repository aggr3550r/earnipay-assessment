import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import * as JWT from 'jsonwebtoken';
import { JWTException } from '../exceptions/JWTException';

const scrypt = promisify(_scrypt);

export default class SecurityUtil {
  /**
   *
   * @param password
   * @returns
   */
  static async encryptPassword(password: string) {
    try {
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      const encryptedPassword = salt.concat('.', hash.toString('hex'));

      return encryptedPassword;
    } catch (error) {
      console.log('An error occured while encrypting this password.');
      console.error(error);
    }
  }

  static async generateTokenWithSecretAndId(id: any): Promise<string> {
    return JWT.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  static async verifyTokenWithSecret(token: any, secretKey: string) {
    try {
      const decoded = JWT.verify(token, secretKey);
      return decoded;
    } catch (error) {
      console.error('verifyTokenWithSecret error()');
      throw new JWTException(error.message.toString().toLocaleUpperCase());
    }
  }

  static async passwordIsCorrect(
    encryptedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    try {
      const [salt, storedHash] = encryptedPassword.split('.');

      const hash = (await scrypt(plainPassword, salt, 32)) as Buffer;

      return storedHash === hash.toString('hex') ? true : false;
    } catch (error) {
      console.error('verifyPassword() error \n %o', error);
    }
  }
}
