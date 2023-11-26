import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useState } from 'react';
import '../assets/css/search.css';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [recentSearches, setRecentSearches] = useState(['Foods']);
  const filterOptions = ['All', 'Location', 'Category'];

  const handleSearch = (): void => {
    console.log('Searching for:', searchTerm);
    console.log('Filter selected:', selectedFilter);

    if (searchTerm.trim() !== '') {
      const updatedSearches = [searchTerm, ...recentSearches];
      if (updatedSearches.length > 3) {
        updatedSearches.pop();
      }
      setRecentSearches(updatedSearches);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = (index: number): void => {
    const updatedSearches = [...recentSearches];
    updatedSearches.splice(index, 1);
    setRecentSearches(updatedSearches);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonGrid>
            <IonCol>
              <IonSearchbar
                className="searchbar"
                placeholder="Search"
                value={searchTerm}
                onIonChange={(e) => setSearchTerm(e.detail.value!)}
                onIonClear={() => setSearchTerm('')}
                onKeyPress={handleKeyPress}
              ></IonSearchbar>
            </IonCol>
          </IonGrid>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="filter-options">
          {filterOptions.map((filter, index) => (
            <IonButton
              key={index}
              fill="clear"
              size="small"
              className={`filter-button ${selectedFilter === filter ? 'selected' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </IonButton>
          ))}
        </div>

        <div className="recent-searches">
          <IonList>
            <IonItem>
              <IonLabel className='recent-label'>Recent Searches</IonLabel>
            </IonItem>
            {recentSearches.map((search, index) => (
              <IonItem key={index}>
                <IonLabel>{search}</IonLabel>
                <IonButtons slot="end">
                  <IonButton fill="clear" size="small" onClick={() => handleClearSearch(index)}>
                    <IonIcon icon={close} />
                  </IonButton>
                </IonButtons>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Search;
