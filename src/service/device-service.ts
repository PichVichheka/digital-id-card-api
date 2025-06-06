// src/device/device.service.ts

import { AppDataSource } from '@/config/data-source';
import { DeviceDto } from '@/dto/request-dto/device-dto';
import { Device } from '@/entities/device';
import { User } from '@/entities/user';

export const saveDevice = async (userId: string, dataDevice: DeviceDto) => {
  const deviceRepo = AppDataSource.getRepository(Device);
  const device = deviceRepo.create({
    ...dataDevice,
    device_name: dataDevice.device_name,
    ip_address: dataDevice.ip_address,
    browser: dataDevice.browser,
    os: dataDevice.os,
    user: { id: userId } as unknown as User,
  });
  await deviceRepo.save(device);
};
