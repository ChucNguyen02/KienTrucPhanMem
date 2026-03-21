import { useState } from 'react';
import type { StudentProfile } from '../types/student';

const STORAGE_KEY = 'micro-lab03-student-profile';

const defaultProfile: StudentProfile = {
    studentCode: '22707281',
    studentName: 'Nguyen Van A',
};

export function useStudentProfile() {
    const [profile, setProfile] = useState<StudentProfile>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            return defaultProfile;
        }

        try {
            const parsed = JSON.parse(saved) as StudentProfile;
            if (parsed.studentCode && parsed.studentName) {
                return parsed;
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }

        return defaultProfile;
    });

    const updateProfile = (value: StudentProfile) => {
        setProfile(value);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    };

    return {
        profile,
        updateProfile,
    };
}
