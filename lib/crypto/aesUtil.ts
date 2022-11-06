/**
 *  Cryptography Functions
 *
 *  Forked from AndiDittrich/AesUtil.js
 *  https://gist.github.com/AndiDittrich/4629e7db04819244e843
 */

import crypto, { CipherGCM, CipherGCMTypes, DecipherGCM } from 'crypto';

/**
 * Get encryption/decryption algorithm
 */
function getAlgorithm(): CipherGCMTypes {
  return 'aes-256-gcm';
}

/**
 * Get encrypted string prefix
 */
function getEncryptedPrefix(): string {
  return 'enc::';
}

/**
 * Derive 256 bit encryption key from password, using salt and iterations -> 32 bytes
 * @param password
 * @param salt
 * @param iterations
 */
function deriveKeyFromPassword(password: string, salt: Buffer, iterations: number): Buffer {
  return crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha512');
}

/**
 * Encrypt AES 256 GCM
 * @param plainText
 * @param password
 */
export function encryptAesGcm(_plainText: string | object, password: string): string | undefined {
  let plainText = _plainText;
  try {
    if (typeof plainText === 'object') {
      plainText = JSON.stringify(plainText);
    } else {
      plainText = String(plainText);
    }

    const algorithm: CipherGCMTypes = getAlgorithm();

    // Generate random salt -> 64 bytes
    const salt = crypto.randomBytes(64);

    // Generate random initialization vector -> 16 bytes
    const iv = crypto.randomBytes(16);

    // Generate random count of iterations between 10.000 - 99.999 -> 5 bytes
    const iterations = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

    // Derive encryption key
    const encryptionKey = deriveKeyFromPassword(
      password,
      salt,
      Math.floor(iterations * 0.47 + 1337)
    );

    // Create cipher
    // @ts-ignore: TS expects the wrong createCipher return type here
    const cipher: CipherGCM = crypto.createCipheriv(algorithm, encryptionKey, iv);

    // Update the cipher with data to be encrypted and close cipher
    const encryptedData = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);

    // Get authTag from cipher for decryption // 16 bytes
    const authTag = cipher.getAuthTag();

    // Join all data into single string, include requirements for decryption
    const output = Buffer.concat([
      salt,
      iv,
      authTag,
      Buffer.from(iterations.toString()),
      encryptedData,
    ]).toString('hex');

    return getEncryptedPrefix() + output;
  } catch (error) {
    console.error('Encryption failed!');
    console.error(error);
    return undefined;
  }
}

/**
 * Decrypt AES 256 GCM
 * @param cipherText
 * @param password
 */
export function decryptAesGcm(_cipherText: string, password: string): string | undefined {
  let cipherText = _cipherText;
  try {
    const algorithm: CipherGCMTypes = getAlgorithm();

    const cipherTextParts = cipherText.split(getEncryptedPrefix());

    // If it's not encrypted by this, reject with undefined
    if (cipherTextParts.length !== 2) {
      console.error(
        'Could not determine the beginning of the cipherText. Maybe not encrypted by this method.'
      );
      return undefined;
    }
    [cipherText] = cipherTextParts;

    const inputData: Buffer = Buffer.from(cipherText, 'hex');

    // Split cipherText into partials
    const salt: Buffer = inputData.slice(0, 64);
    const iv: Buffer = inputData.slice(64, 80);
    const authTag: Buffer = inputData.slice(80, 96);
    const iterations: number = parseInt(inputData.slice(96, 101).toString('utf-8'), 10);
    const encryptedData: Buffer = inputData.slice(101);

    // Derive key
    const decryptionKey = deriveKeyFromPassword(
      password,
      salt,
      Math.floor(iterations * 0.47 + 1337)
    );

    // Create decipher
    // @ts-ignore: TS expects the wrong createDecipher return type here
    const decipher: DecipherGCM = crypto.createDecipheriv(algorithm, decryptionKey, iv);
    decipher.setAuthTag(authTag);

    // Decrypt data
    // @ts-ignore: TS expects the wrong createDecipher return type here
    const decrypted = decipher.update(encryptedData, 'binary', 'utf-8') + decipher.final('utf-8');

    try {
      return JSON.parse(decrypted);
    } catch (error) {
      return decrypted;
    }
  } catch (error) {
    console.error('Decryption failed!');
    console.error(error);
    return undefined;
  }
}
