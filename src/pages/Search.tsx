import React, { useState, useEffect, useRef } from 'react';
import {IonButton,IonButtons,IonCol,IonAvatar,IonContent,IonGrid,IonHeader,IonIcon,IonItem,IonLabel,IonList,IonPage,IonSearchbar,IonToolbar} from '@ionic/react';
import { locationOutline, timeOutline } from 'ionicons/icons';
import { close } from 'ionicons/icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { formatDistanceToNow } from 'date-fns';
import { useHistory } from 'react-router-dom';
import '../assets/css/search.css';
import '../assets/css/home.css';

interface Post {
  id: string;
  title: string;
  description: string;
  pickupTime: string;
  location: string;
  selectedCategory: string;
  images: string[];
  userName: string;
  userId: string;
  postedAt:string;
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

  // Function to handle search
  const handleSearch = async (): Promise<void> => {
    if (searchTerm.trim() !== '') {
      const updatedSearches = [searchTerm, ...recentSearches];
      if (updatedSearches.length > 5) {
        updatedSearches.pop();
      }
      setRecentSearches(updatedSearches);
      setSelectedFilter('All');

      fetchDataFromFirebase(searchTerm, 'All');
    }
  };

const handleClearSearch = (index: number, event: React.MouseEvent): void => {
  event.stopPropagation(); 

  const updatedSearches = [...recentSearches];
  const deletedSearch = updatedSearches.splice(index, 1)[0];
  setRecentSearches(updatedSearches);
  if (searchTerm === deletedSearch) {
    setSearchTerm('');
    fetchDataFromFirebase('', selectedFilter); 
  }
};

  const handleRecentSearchClick = (searchTerm: string): void => {
    setSearchTerm(searchTerm);
    handleSearch(); 
  };

  const fetchDataFromFirebase = async (searchTerm: string, selectedFilter: string | null) => {
    try {
      const postsRef = firebase.firestore().collection('posts');
      const usersRef = firebase.firestore().collection('users');

      const snapshot = await postsRef.get();

      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      const filteredPosts = postsData.filter((post) => {
        const lowercaseSearchTerm = searchTerm.toLowerCase();

        if (selectedFilter && selectedFilter !== 'All') {
          const searchTermMatch =
            post.description.toLowerCase().includes(lowercaseSearchTerm) ||
            post.title.toLowerCase().includes(lowercaseSearchTerm) ||
            post.location.toLowerCase().includes(lowercaseSearchTerm) ||
            post.selectedCategory.toLowerCase().includes(lowercaseSearchTerm);

          const filterMatch = post.selectedCategory.toLowerCase() === selectedFilter.toLowerCase();

          return searchTermMatch && filterMatch;
        } else {
          return (
            post.description.toLowerCase().includes(lowercaseSearchTerm) ||
            post.title.toLowerCase().includes(lowercaseSearchTerm) ||
            post.location.toLowerCase().includes(lowercaseSearchTerm) ||
            post.selectedCategory.toLowerCase().includes(lowercaseSearchTerm)
          );
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
  }; //
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const handleFilterClick = (filter: 'All' | 'Excess/Extra Food' | 'Donation' | 'Expiry Soon' | 'Looking for Food'): void => {
    setSelectedFilter(filter);
    handleFilterScroll(filter);
    fetchDataFromFirebase(searchTerm, filter)
      .then((filteredPosts) => setSearchResults(filteredPosts))
      .catch((error) => console.error('Error fetching filtered data:', error));
  };

  // Function to handle filter scroll
  const handleFilterScroll = (filter: 'All' | 'Excess/Extra Food' | 'Donation' | 'Expiry Soon' | 'Looking for Food'): void => {
    if (filterContainerRef.current) {
      const index = filterOptions.indexOf(filter);
      const scrollPosition = index * 100; // Assuming each tab has a fixed width of 100px
      filterContainerRef.current.scrollLeft = scrollPosition;
    }
  };

  // Effect hook to fetch initial data
 // Effect hook to fetch initial data
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
                  <IonButton
                    fill="clear"
                    size="small"
                    onClick={(event) => handleClearSearch(index, event)}
                  >
                    <IonIcon icon={close} />
                  </IonButton>
                  </IonButtons>
                </IonItem>
              ))}
            </IonList>
          </div>
        )}

        {searchResults.length > 0 && (
          <IonList>
            {searchResults.map((post) => (
              <IonItem key={post.id} className="post">
                <div className="user-info">
                  <IonAvatar className="avatar">
                    <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                  </IonAvatar>
                  <div className="user-details">
                    <span className="user-name">{users[post.userId]?.username || 'Unknown User'}</span>
                    <span className="post-time">{post.postedAt ? formatDistanceToNow(new Date(post.postedAt)) : 'Unknown time ago'}</span>
                  </div>
                  <IonButton
                    fill="clear"
                    className="message-button"
                    onClick={() => history.push(`/messages/${users[post.userId]?.username}`)}
                  >
                    Message
                  </IonButton>
                </div>
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <p>Category: {post.selectedCategory}</p>
                </div>
                <div className="post-details">
                  <div className="details-container">
                    <p className="details">
                      <IonIcon icon={locationOutline} className="icon" />
                      {post.location} <IonIcon icon={timeOutline} className="icon" /> Expiration Date: {post.pickupTime}
                    </p>
                  </div>
                </div>
                {post.images && post.images.length > 0 && (
                  <div className="post-image-container">
                    <div className="image-container">
                      {post.images.map((image: string, index: number) => (
                        <img key={index} src={image} alt={`Image ${index}`} className="post-image" />
                      ))}
                    </div>
                  </div>
                )}
              </IonItem>
            ))}
          </IonList>
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
