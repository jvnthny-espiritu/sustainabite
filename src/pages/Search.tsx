import React, { useState, useEffect, useRef } from 'react';
import { IonButton, IonButtons, IonCol, IonAvatar, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonSearchbar, IonToolbar } from '@ionic/react';
import { locationOutline, timeOutline } from 'ionicons/icons';
import { close } from 'ionicons/icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { formatDistanceToNow } from 'date-fns';
import { useHistory } from 'react-router-dom';
import PostCard from '../components/PostCard';
import '../assets/css/search.css';

interface Post {
  id: string;
  title: string;
  description: string;
  location: string;
  selectedCategory: string;
  images: string[];
  name: string;
  userId: string;
  postedAt: string;
}

interface UserData {
  username: string;
  name: string;
}

const Search: React.FC = () => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [dataFetching, setDataFetching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Excess/Extra Food' | 'Donation' | 'Expiry Soon' | 'Looking for Food'>('All');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [users, setUsers] = useState<{ [key: string]: UserData }>({});
  const filterOptions: ('All' | 'Excess/Extra Food' | 'Donation' | 'Expiry Soon' | 'Looking for Food')[] = ['All', 'Excess/Extra Food', 'Donation', 'Expiry Soon', 'Looking for Food'];
  const filterContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (): Promise<void> => {
    if (searchTerm.trim() !== '') {
      const updatedSearches = [searchTerm, ...recentSearches].slice(0, 5);
      setRecentSearches(updatedSearches);
      setSelectedFilter('All');
      fetchDataFromFirebase(searchTerm, 'All');
    }
  };

  const handleClearSearch = (index: number, event: React.MouseEvent): void => {
    event.stopPropagation();
    const deletedSearch = recentSearches[index];
    setRecentSearches((prevSearches) => prevSearches.filter((_, i) => i !== index));
    if (searchTerm === deletedSearch) {
      setSearchTerm('');
      fetchDataFromFirebase('', selectedFilter);
    }
  };

  const handleRecentSearchClick = (searchTerm: string): void => {
    setSearchTerm(searchTerm);
    handleSearch();
  };

  const handleFilterClick = (filter: 'All' | 'Excess/Extra Food' | 'Donation' | 'Expiry Soon' | 'Looking for Food'): void => {
    setSelectedFilter(filter);
    handleFilterScroll(filter);
    fetchDataFromFirebase(searchTerm, filter).then((filteredPosts) => setSearchResults(filteredPosts)).catch((error) => console.error('Error fetching filtered data:', error));
  };

  const handleFilterScroll = (filter: 'All' | 'Excess/Extra Food' | 'Donation' | 'Expiry Soon' | 'Looking for Food'): void => {
    if (filterContainerRef.current) {
      const index = filterOptions.indexOf(filter);
      const scrollPosition = index * 100; // Assuming each tab has a fixed width of 100px
      filterContainerRef.current.scrollLeft = scrollPosition;
    }
  };

  const fetchDataFromFirebase = async (searchTerm: string, selectedFilter: string | null) => {
    try {
      const postsRef = firebase.firestore().collection('posts');
      const usersRef = firebase.firestore().collection('users');
      const snapshot = await postsRef.get();
      const postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[];

      const filteredPosts = postsData.filter((post) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        const searchTermMatch = (field: string) => field.toLowerCase().includes(lowercasedTerm);

        if (selectedFilter && selectedFilter !== 'All') {
          const filterMatch = post.selectedCategory.toLowerCase() === selectedFilter.toLowerCase();
          return searchTermMatch(post.description) || searchTermMatch(post.title) || searchTermMatch(post.location) || searchTermMatch(post.selectedCategory) && filterMatch;
        } else {
          return searchTermMatch(post.description) || searchTermMatch(post.title) || searchTermMatch(post.location) || searchTermMatch(post.selectedCategory);
        }
      });

      const usersSnapshot = await usersRef.get();
      const usersData: { [key: string]: UserData } = {};
      usersSnapshot.forEach((doc) => {
        usersData[doc.id] = doc.data() as UserData;
      });
      setUsers(usersData);

      return filteredPosts;
    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.trim() !== '') {
        try {
          setDataFetching(true);
          const results = await fetchDataFromFirebase(searchTerm, selectedFilter);
          setSearchResults(results);
        } finally {
          setDataFetching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchData();
  }, [searchTerm, selectedFilter]);

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
                onIonClear={() => {
                  setSearchTerm('');
                  handleSearch();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && searchTerm.trim() !== '') {
                    setSearchTerm((prevSearchTerm) => prevSearchTerm.slice(0, -1));
                  }
                }}
              />
            </IonCol>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {searchTerm ? (
          <div className="filter-options" ref={filterContainerRef}>
            {filterOptions.map((filter, index) => (
              <IonButton
                key={index}
                fill="clear"
                size="small"
                className={`filter-button ${selectedFilter === filter ? 'selected' : ''}`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </IonButton>
            ))}
          </div>
        ) : (
          <div className="recent-searches">
            <IonList>
              <IonItem>
                <IonLabel className="recent-label">Recent Searches</IonLabel>
              </IonItem>
              {recentSearches.map((search, index) => (
                <IonItem key={index} onClick={() => handleRecentSearchClick(search)}>
                  <IonLabel>{search}</IonLabel>
                  <IonButtons slot="end">
                    <IonButton fill="clear" size="small" onClick={(event) => handleClearSearch(index, event)}>
                      <IonIcon icon={close} />
                    </IonButton>
                  </IonButtons>
                </IonItem>
              ))}
            </IonList>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="custom-list">
            {searchResults.map((post) => (
              <PostCard key={post.id} data={{
                userName: users[post.userId]?.username || 'Unknown User',
                postTime: post.postedAt ? formatDistanceToNow(new Date(post.postedAt)) : 'Unknown time ago',
                category: post.selectedCategory,
                postTitle: post.title,
                postContent: post.description,
                location: post.location,
                images: post.images || [],
              }} />
            ))}
          </div>
        )}

        {searchResults.length === 0 && searchTerm.trim() !== '' && (
          <IonList>
            {selectedFilter !== 'All' && (
              <IonItem>
                <IonLabel>No results found for "{searchTerm}" in {selectedFilter.toLowerCase()}</IonLabel>
              </IonItem>
            )}
            {selectedFilter === 'All' && (
              <IonItem>
                <IonLabel>No results found for "{searchTerm}"</IonLabel>
              </IonItem>
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Search;
