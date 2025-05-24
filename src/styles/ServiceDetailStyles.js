import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#1a4b8c'; // Royal blue

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  headerContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 6,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F0F5FF',
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#505F79',
    // fontWeight: '500', // Handled by AppText
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F5F7FF',
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#E6E8F0',
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
    fontFamily: 'Poppins-Regular', // For TextInput
  },
  searchIcon: {
    marginRight: 10,
    color: '#A0A0A0',
  },
  clearIcon: {
    padding: 5,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 4,
  },
  sortTitle: {
    fontSize: 14,
    marginRight: 12,
    // fontFamily: 'Poppins-Bold', // Handled by AppText
    color: '#505F79',
  },
  sortOptions: {
    flexDirection: 'row',
    flex: 1,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  activeSortButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  sortButtonText: {
    fontSize: 13,
    color: '#505F79',
    // fontWeight: '500', // Handled by AppText
  },
  activeSortButtonText: {
    color: 'white',
    // fontWeight: 'bold', // Handled by AppText with bold prop
  },
  listContainer: {
    padding: 16,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#505F79',
    // fontWeight: '500', // Handled by AppText
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  noResultsTitle: {
    fontSize: 18,
    color: '#505F79',
    // fontFamily: 'Poppins-Bold', // Handled by AppText
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    color: '#8C95A6',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default styles;