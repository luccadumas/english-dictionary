'use client';

import { X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { User } from '@/types/auth.types';
import { formatDate } from '@/lib/utils';
import { UserAvatar } from '@/components/layout/user-avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserProfileModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function UserProfileModal({ user, open, onOpenChange }: UserProfileModalProps) {
  const t = useTranslations('navigation');
  const locale = useLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" aria-describedby="user-profile-desc">
        <DialogHeader className="flex-row items-start justify-between space-y-0">
          <div className="space-y-1">
            <DialogTitle>{t('profileTitle')}</DialogTitle>
            <DialogDescription id="user-profile-desc">
              {t('profileDescription')}
            </DialogDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            aria-label={t('closeProfile')}
            className="h-8 w-8 shrink-0 p-0"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 px-6 pb-6 pt-2">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <dl className="grid gap-4 rounded-xl border border-border/60 bg-muted/30 p-4 dark:bg-card/40">
            <ProfileField label={t('profileName')} value={user.name} />
            <ProfileField label={t('profileEmail')} value={user.email} />
            <ProfileField
              label={t('profileMemberSince')}
              value={formatDate(user.createdAt, locale)}
            />
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}
