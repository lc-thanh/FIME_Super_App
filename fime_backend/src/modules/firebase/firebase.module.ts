import { FirebaseService } from '@/modules/firebase/firebase.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    // Kiểm tra xem app đã khởi tạo chưa để tránh lỗi duplicate
    if (!admin.apps.length) {
      const firebaseConfig = {
        type: configService.get<string>('FBS_TYPE'),
        projectId: configService.get<string>('FBS_PROJECT_ID'),
        privateKeyId: configService.get<string>('FBS_PRIVATE_KEY_ID'),
        privateKey: configService.get<string>('FBS_PRIVATE_KEY'),
        clientEmail: configService.get<string>('FBS_CLIENT_EMAIL'),
        clientId: configService.get<string>('FBS_CLIENT_ID'),
        authUri: configService.get<string>('FBS_AUTH_URI'),
        tokenUri: configService.get<string>('FBS_TOKEN_URI'),
        authProviderX509CertUrl: configService.get<string>(
          'FBS_AUTH_PROVIDER_X509_CERT_URL',
        ),
        clientX509CertUrl: configService.get<string>(
          'FBS_CLIENT_X509_CERT_URL',
        ),
        universeDomain: configService.get<string>('FBS_UNIVERSE_DOMAIN'),
      } as admin.ServiceAccount;

      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        storageBucket: `${firebaseConfig.projectId}.firebasestorage.app`,
      });
    }
    return admin.app();
  },
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [firebaseProvider, FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
