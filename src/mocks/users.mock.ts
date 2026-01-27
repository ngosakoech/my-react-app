import type { User } from '../types/auth.types';
import { UserRole } from '../types/auth.types';

export const mockUsers: User[] = [
  {
    id: 'usr-001',
    email: 'john.kamau@unitedwinners.co.ke',
    firstName: 'John',
    lastName: 'Kamau',
    role: UserRole.ADMIN,
    position: 'Chief Executive Officer',
    department: 'Executive',
    phone: '+254 722 123456',
    avatar: 'https://i.pravatar.cc/150?img=12',
    isActive: true,
    lastLogin: new Date('2024-01-15T08:30:00'),
    createdAt: new Date('2022-01-10T00:00:00')
  },
  {
    id: 'usr-002',
    email: 'sarah.wanjiru@unitedwinners.co.ke',
    firstName: 'Sarah',
    lastName: 'Wanjiru',
    role: UserRole.CHAIRPERSON,
    position: 'Board Chairperson',
    department: 'Board',
    phone: '+254 733 234567',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isActive: true,
    lastLogin: new Date('2024-01-15T09:15:00'),
    createdAt: new Date('2022-01-10T00:00:00')
  },
  {
    id: 'usr-003',
    email: 'peter.omondi@unitedwinners.co.ke',
    firstName: 'Peter',
    lastName: 'Omondi',
    role: UserRole.SECRETARY,
    position: 'Board Secretary',
    department: 'Administration',
    phone: '+254 744 345678',
    avatar: 'https://i.pravatar.cc/150?img=33',
    isActive: true,
    lastLogin: new Date('2024-01-15T07:45:00'),
    createdAt: new Date('2022-01-10T00:00:00')
  },
  {
    id: 'usr-004',
    email: 'grace.muthoni@unitedwinners.co.ke',
    firstName: 'Grace',
    lastName: 'Muthoni',
    role: UserRole.BOARD_MEMBER,
    position: 'Board Member - Finance',
    department: 'Finance',
    phone: '+254 755 456789',
    avatar: 'https://i.pravatar.cc/150?img=47',
    isActive: true,
    lastLogin: new Date('2024-01-14T16:20:00'),
    createdAt: new Date('2022-02-15T00:00:00')
  },
  {
    id: 'usr-005',
    email: 'david.kipchoge@unitedwinners.co.ke',
    firstName: 'David',
    lastName: 'Kipchoge',
    role: UserRole.BOARD_MEMBER,
    position: 'Board Member - Operations',
    department: 'Operations',
    phone: '+254 766 567890',
    avatar: 'https://i.pravatar.cc/150?img=14',
    isActive: true,
    lastLogin: new Date('2024-01-15T10:00:00'),
    createdAt: new Date('2022-02-15T00:00:00')
  },
  {
    id: 'usr-006',
    email: 'mary.akinyi@unitedwinners.co.ke',
    firstName: 'Mary',
    lastName: 'Akinyi',
    role: UserRole.BOARD_MEMBER,
    position: 'Board Member - Risk Management',
    department: 'Risk',
    phone: '+254 777 678901',
    avatar: 'https://i.pravatar.cc/150?img=20',
    isActive: true,
    lastLogin: new Date('2024-01-15T08:45:00'),
    createdAt: new Date('2022-03-01T00:00:00')
  },
  {
    id: 'usr-007',
    email: 'james.njoroge@unitedwinners.co.ke',
    firstName: 'James',
    lastName: 'Njoroge',
    role: UserRole.BOARD_MEMBER,
    position: 'Board Member - Audit',
    department: 'Audit',
    phone: '+254 788 789012',
    avatar: 'https://i.pravatar.cc/150?img=51',
    isActive: true,
    lastLogin: new Date('2024-01-13T14:30:00'),
    createdAt: new Date('2022-03-01T00:00:00')
  },
  {
    id: 'usr-008',
    email: 'elizabeth.wangari@unitedwinners.co.ke',
    firstName: 'Elizabeth',
    lastName: 'Wangari',
    role: UserRole.SUBCOMMITTEE_MEMBER,
    position: 'Credit Committee Member',
    department: 'Credit',
    phone: '+254 799 890123',
    avatar: 'https://i.pravatar.cc/150?img=9',
    isActive: true,
    lastLogin: new Date('2024-01-15T11:20:00'),
    createdAt: new Date('2022-04-20T00:00:00')
  },
  {
    id: 'usr-009',
    email: 'michael.otieno@unitedwinners.co.ke',
    firstName: 'Michael',
    lastName: 'Otieno',
    role: UserRole.SUBCOMMITTEE_MEMBER,
    position: 'Credit Committee Member',
    department: 'Credit',
    phone: '+254 710 901234',
    avatar: 'https://i.pravatar.cc/150?img=13',
    isActive: true,
    lastLogin: new Date('2024-01-15T09:30:00'),
    createdAt: new Date('2022-04-20T00:00:00')
  },
  {
    id: 'usr-010',
    email: 'ruth.chebet@unitedwinners.co.ke',
    firstName: 'Ruth',
    lastName: 'Chebet',
    role: UserRole.SUBCOMMITTEE_MEMBER,
    position: 'HR Committee Member',
    department: 'Human Resources',
    phone: '+254 721 012345',
    avatar: 'https://i.pravatar.cc/150?img=26',
    isActive: true,
    lastLogin: new Date('2024-01-14T15:45:00'),
    createdAt: new Date('2022-05-10T00:00:00')
  },
  {
    id: 'usr-011',
    email: 'daniel.mutua@unitedwinners.co.ke',
    firstName: 'Daniel',
    lastName: 'Mutua',
    role: UserRole.BOARD_MEMBER,
    position: 'Board Member - Strategy',
    department: 'Strategy',
    phone: '+254 732 123456',
    avatar: 'https://i.pravatar.cc/150?img=68',
    isActive: true,
    lastLogin: new Date('2024-01-15T08:00:00'),
    createdAt: new Date('2022-05-10T00:00:00')
  },
  {
    id: 'usr-012',
    email: 'faith.nyambura@unitedwinners.co.ke',
    firstName: 'Faith',
    lastName: 'Nyambura',
    role: UserRole.SUBCOMMITTEE_MEMBER,
    position: 'Audit Committee Member',
    department: 'Audit',
    phone: '+254 743 234567',
    avatar: 'https://i.pravatar.cc/150?img=45',
    isActive: true,
    lastLogin: new Date('2024-01-15T10:30:00'),
    createdAt: new Date('2022-06-01T00:00:00')
  },
  {
    id: 'usr-013',
    email: 'joseph.kimani@unitedwinners.co.ke',
    firstName: 'Joseph',
    lastName: 'Kimani',
    role: UserRole.SUBCOMMITTEE_MEMBER,
    position: 'Investment Committee Member',
    department: 'Investment',
    phone: '+254 754 345678',
    avatar: 'https://i.pravatar.cc/150?img=56',
    isActive: true,
    lastLogin: new Date('2024-01-14T17:00:00'),
    createdAt: new Date('2022-06-15T00:00:00')
  },
  {
    id: 'usr-014',
    email: 'anne.wambui@unitedwinners.co.ke',
    firstName: 'Anne',
    lastName: 'Wambui',
    role: UserRole.BOARD_MEMBER,
    position: 'Board Member - IT',
    department: 'Information Technology',
    phone: '+254 765 456789',
    avatar: 'https://i.pravatar.cc/150?img=16',
    isActive: true,
    lastLogin: new Date('2024-01-15T07:30:00'),
    createdAt: new Date('2022-07-01T00:00:00')
  },
  {
    id: 'usr-015',
    email: 'samuel.korir@unitedwinners.co.ke',
    firstName: 'Samuel',
    lastName: 'Korir',
    role: UserRole.SUBCOMMITTEE_MEMBER,
    position: 'Compliance Committee Member',
    department: 'Compliance',
    phone: '+254 776 567890',
    avatar: 'https://i.pravatar.cc/150?img=60',
    isActive: true,
    lastLogin: new Date('2024-01-15T09:00:00'),
    createdAt: new Date('2022-08-01T00:00:00')
  },
  {
    id: 'usr-016',
    email: 'lucy.auma@unitedwinners.co.ke',
    firstName: 'Lucy',
    lastName: 'Auma',
    role: UserRole.BOARD_MEMBER,
    position: 'Board Member - Governance',
    department: 'Governance',
    phone: '+254 787 678901',
    avatar: 'https://i.pravatar.cc/150?img=31',
    isActive: true,
    lastLogin: new Date('2024-01-14T13:20:00'),
    createdAt: new Date('2022-09-01T00:00:00')
  }
];

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};

export const getActiveUsers = (): User[] => {
  return mockUsers.filter(user => user.isActive);
};
