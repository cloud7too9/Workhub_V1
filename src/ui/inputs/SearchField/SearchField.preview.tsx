import { useState } from 'react';
import { SearchField } from './SearchField';

function SearchFieldDemo() {
  const [val, setVal] = useState('');
  const [filled, setFilled] = useState('Button');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <SearchField value={val} onChange={setVal} placeholder="Suchen…" />
      <SearchField value={filled} onChange={setFilled} placeholder="Suchen…" />
    </div>
  );
}

export const searchFieldPreviews = {
  id: 'search-field',
  name: 'SearchField',
  sections: [
    { title: 'Zustände', render: () => <SearchFieldDemo /> },
  ],
};
