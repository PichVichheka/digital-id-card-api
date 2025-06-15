import { AppDataSource } from '@/config/data-source';
import { IdCard } from '@/entities/id-card';
import { SocialLink } from '@/entities/social-link';
import { Request, Response } from 'express';

type SocialLinkInput = {
  id?: string;
  platform: string;
  icon: string;
  url: string;
};

/**
 *
 * - path /api/v1/card/crate-card - Create Card
 * - method: CREATE
 * - roles: [USER]
 */
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

/**
 *
 * - path /api/v1/card/update-card - Create Card
 * - method: PUT
 * - roles: [USER]
 */
export const updateCardService = async (req: Request, res: Response) => {
  const cardId = req.params.id;
  const userId = req.user?.user_id;

  const { gender, dob, address, phone, nationality, social = [] } = req.body;

  const cardRepo = AppDataSource.getRepository(IdCard);
  const socialLinkRepo = AppDataSource.getRepository(SocialLink);

  const card = await cardRepo.findOne({
    where: { id: cardId, user: { id: userId } },
    relations: ['socialLinks'],
  });

  if (!card) {
    return res.status(404).json({ message: 'Card not found' });
  }

  // Update card basic info
  card.gender = gender;
  card.dob = dob;
  card.address = address;
  card.phone = phone;
  card.nationality = nationality;
  await cardRepo.save(card);

  const incomingIds = social.filter((s: any) => s.id).map((s: any) => s.id);

  // ❌ Soft-delete any existing social links not in req.body
  const linksToDelete = card.socialLinks?.filter(
    (link) => !incomingIds.includes(link.id) && !link.is_deleted,
  ) as any;

  await Promise.all(
    linksToDelete.map((link: any) =>
      socialLinkRepo.update(link.id, { is_deleted: true }),
    ),
  );

  // ✅ Process incoming social links
  const updatedLinks = await Promise.all(
    social.map(async (item: any) => {
      if (item.id) {
        // Only update if it already exists AND is not soft-deleted
        const existing = await socialLinkRepo.findOne({
          where: { id: item.id, is_deleted: false },
        });

        if (existing) {
          existing.platform = item.platform;
          existing.icon = item.icon;
          existing.url = item.url;
          return await socialLinkRepo.save(existing);
        }

        // Don't auto-restore deleted items
        return null;
      } else {
        // Create new social link
        const newLink = socialLinkRepo.create({
          card: { id: card.id },
          platform: item.platform,
          icon: item.icon,
          url: item.url,
        });
        return await socialLinkRepo.save(newLink);
      }
    }),
  );

  // ✅ Return only non-deleted links
  const activeLinks = await socialLinkRepo.find({
    where: { card: { id: card.id }, is_deleted: false },
  });

  // Remove circular refs before sending
  const cleanedLinks = activeLinks.map(({ card, ...rest }) => rest);

  return {
    message: 'Update card successfully',
    card: {
      ...card,
      socialLinks: undefined,
    },
    socialLinks: cleanedLinks,
  };
};
