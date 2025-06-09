import { AppDataSource } from '@/config/data-source';
import { IdCard } from '@/entities/id-card';
import { SocialLink } from '@/entities/social-link';
import { Request, Response } from 'express';
// export const createCardService = async (req: Request, res: Response) => {
//   const userId = req.user?.user_id;

//   const { address, phone, platform, nationality, url, icon, gender, dob } =
//     req.body;

//   await AppDataSource.transaction(async (manager) => {
//     // Step 1: Create and save card
//     const card = manager.create(IdCard, {
//       user: { id: userId },
//       gender,
//       dob,
//       address,
//       nationality,
//       phone,
//     });

//     const savedCard = await manager.save(IdCard, card);

//     // Step 2: Create and save social link using savedCard
//     const socialLink = manager.create(SocialLink, {
//       card: { id: savedCard.id },
//       platform,
//       url,
//       icon,
//     });

//     const savedSocialLink = await manager.save(SocialLink, socialLink);

//     // Step 3: Send response
//     res.json({
//       message: 'create card successfully',
//       card: savedCard,
//       socialLink: savedSocialLink,
//     });
//   });
// };

export const createCardService = async (req: Request, res: Response) => {
  const cardRepo = AppDataSource.getRepository(IdCard);
  const socialLinkRepo = AppDataSource.getRepository(SocialLink);
  const userId = req.user?.user_id;
  const {
    // id card
    gender,
    dob,
    address,
    phone,
    nationality,
    // social link
    platform,
    icon,
    url,
    social = [],
  } = req.body;

  const card = cardRepo.create({
    user: { id: userId },
    gender,
    dob,
    address,
    phone,
    nationality,
  });
  const newCard = await cardRepo.save(card);

  // Create and save all social links
  const socialLinks = social.map((item: any) =>
    socialLinkRepo.create({
      card: { id: newCard.id },
      platform: item.platform,
      icon: item.icon,
      url: item.url,
    }),
  );

  await socialLinkRepo.save(socialLinks);
  return {
    message: 'create card successfully',
    card: newCard,
    socialLinks: socialLinks,
  };
};
