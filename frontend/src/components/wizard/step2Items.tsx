import React from 'react';
import { Step2ItemsUI } from '@/components/ui/step2ItemsUI';
import { useStep2Items } from '@/hooks/useStep2Items';

export const Step2Items = () => {
  const {
    details,
    searchResults,
    loadingMap,
    activeDropdown,
    containerRef,
    addRow,
    removeRow,
    handleInputChange,
    handleQuantityChange,
    selectItem,
    setActiveDropdown,
    fetchItems,
    setStep,
  } = useStep2Items();

  return (
    <Step2ItemsUI
      details={details}
      searchResults={searchResults}
      loadingMap={loadingMap}
      activeDropdown={activeDropdown}
      containerRef={containerRef}
      onAddRow={addRow}
      onRemoveRow={removeRow}
      onInputChange={handleInputChange}
      onQuantityChange={handleQuantityChange}
      onSelectItem={selectItem}
      onSetActiveDropdown={setActiveDropdown}
      onFetchItems={fetchItems}
      onSetStep={setStep}
    />
  );
};