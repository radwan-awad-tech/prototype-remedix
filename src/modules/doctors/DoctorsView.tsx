import React, { useState } from 'react';
import { DoctorsList } from './components/DoctorsList';
import { AddDoctorWizard } from './components/AddDoctorWizard';
import { DoctorProfile } from './components/DoctorProfile';
import { Doctor } from '../../types';
import { Drawer } from '../../components/ui/Drawer';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { useTranslation } from '../../hooks/useTranslation';

export const DoctorsView: React.FC = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<'list' | 'wizard'>('list');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const { showToast } = useToast();

  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsProfileOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setView('wizard');
  };

  const handleAddNew = () => {
    setEditingDoctor(null);
    setView('wizard');
  };

  const handleWizardComplete = (doctor: Doctor) => {
    // Logic to save doctor
    console.log('Saving doctor:', doctor);
    showToast(
      t(editingDoctor ? 'doctor_updated' : 'doctor_onboarded', { code: doctor.doctorCode }),
      'success'
    );
    setView('list');
    setEditingDoctor(null);
    setSelectedDoctor(doctor);
    setIsProfileOpen(true);
  };

  const handleDeactivate = (doctor: Doctor) => {
    // This would normally open a modal, but the DoctorsList already handles it for the list view.
    // For the profile view, we can just log it for now.
    console.log('Deactivating doctor from profile:', doctor.doctorCode);
    showToast(
      t('deactivation_started', { code: doctor.doctorCode }),
      'info'
    );
  };

  if (view === 'wizard') {
    return (
      <div className="h-[calc(100vh-8rem)]">
        <AddDoctorWizard 
          onCancel={() => setView('list')} 
          onComplete={handleWizardComplete}
          initialDoctor={editingDoctor || undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Medical Staff" 
        titleKey="medical_staff"
        subtitle="Manage doctor credentials, specialties, and clinical status."
        subtitleKey="doctors_subtitle"
      />

      <DoctorsList 
        onViewProfile={handleViewProfile} 
        onEditDoctor={handleEditDoctor}
        onAddNew={handleAddNew}
      />

      <Drawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        size="xl"
        noPadding
      >
        {selectedDoctor && (
          <DoctorProfile 
            doctor={selectedDoctor} 
            onClose={() => setIsProfileOpen(false)}
            onEdit={handleEditDoctor}
            onDeactivate={handleDeactivate}
          />
        )}
      </Drawer>
    </div>
  );
};
