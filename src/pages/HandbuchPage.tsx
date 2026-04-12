import { useState } from 'react';
import { useMetallgruppen } from '@/features/handbuch/hooks/useMetallgruppen';
import { useVerpackung } from '@/features/handbuch/hooks/useVerpackung';
import { HandbuchView } from '@/features/handbuch/views/HandbuchView';
import { MetallgruppenView } from '@/features/handbuch/views/MetallgruppenView';
import { VerpackungView } from '@/features/handbuch/views/VerpackungView';

export function HandbuchPage() {
  const [activeTab, setActiveTab] = useState('metallgruppen');
  const metall = useMetallgruppen();
  const verpackung = useVerpackung();

  return (
    <HandbuchView activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'metallgruppen' && (
        <MetallgruppenView
          filteredGroups={metall.state.filteredGroups}
          search={metall.state.search}
          openId={metall.state.openId}
          formState={metall.state.formState}
          deleteState={metall.state.deleteState}
          totalGroups={metall.state.totalGroups}
          totalMaterials={metall.state.totalMaterials}
          getMaterials={metall.actions.getMaterials}
          getGroupName={metall.actions.getGroupName}
          onSearchChange={metall.actions.setSearch}
          onToggleGroup={metall.actions.toggleGroup}
          onAddMaterial={metall.actions.openAddForm}
          onEditMaterial={metall.actions.openEditForm}
          onDeleteMaterial={metall.actions.confirmDelete}
          onFormSave={metall.state.formState.mode === 'edit' ? metall.actions.handleEdit : metall.actions.handleAdd}
          onFormCancel={metall.actions.closeForm}
          onDeleteConfirm={metall.actions.handleDeleteConfirm}
          onDeleteCancel={metall.actions.cancelDelete}
        />
      )}
      {activeTab === 'verpackung' && (
        <VerpackungView
          filteredGroups={verpackung.state.filteredGroups}
          search={verpackung.state.search}
          openId={verpackung.state.openId}
          totalGroups={verpackung.state.totalGroups}
          totalArticles={verpackung.state.totalArticles}
          onSearchChange={verpackung.actions.setSearch}
          onToggleGroup={verpackung.actions.toggleGroup}
        />
      )}
    </HandbuchView>
  );
}
