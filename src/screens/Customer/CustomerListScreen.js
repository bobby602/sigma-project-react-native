// src/screens/Customer/CustomerListScreen.js
// 👥 Customer List Screen

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchCustomerList, setPage, setFilters } from '../../store/customerSlice';
import { debounce } from '../../utils/helpers';

export default function CustomerListScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const { customerList, pagination, filters, isLoading } = useSelector(
    state => state.customer
  );

  const [searchText, setSearchText] = useState(filters.search);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomerList({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
    }));
  }, [dispatch, pagination.page, filters.search]);

  const debouncedSearch = useCallback(
    debounce((text) => {
      dispatch(setFilters({ search: text }));
      dispatch(setPage(1));
    }, 500),
    [dispatch]
  );

  const handleSearch = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchCustomerList({
      page: 1,
      limit: pagination.limit,
      search: filters.search,
    }));
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoading && pagination.page < pagination.totalPages) {
      dispatch(setPage(pagination.page + 1));
    }
  };

  const handleCustomerPress = (customer) => {
    navigation.navigate('CustomerDetail', { customer });
  };

  const renderCustomer = ({ item }) => (
    <TouchableOpacity
      style={styles.customerCard}
      onPress={() => handleCustomerPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.customerHeader}>
        <View style={styles.avatarContainer}>
          <Icon name="person" size={24} color="#ffffff" />
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerCode}>{item.Code}</Text>
          <Text style={styles.customerName} numberOfLines={1}>
            {item.Name}
          </Text>
        </View>
        <Icon name="chevron-forward" size={20} color="#94a3b8" />
      </View>

      <View style={styles.customerDetails}>
        <View style={styles.detailRow}>
          <Icon name="location-outline" size={16} color="#64748b" />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.addr || 'ไม่ระบุที่อยู่'}
          </Text>
        </View>
        
        {item.Phone && (
          <View style={styles.detailRow}>
            <Icon name="call-outline" size={16} color="#64748b" />
            <Text style={styles.detailText}>{item.Phone}</Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>วงเงิน</Text>
            <Text style={styles.statValue}>฿{item.MaxCr || '0'}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>ระยะเวลา</Text>
            <Text style={styles.statValue}>{item.CRTERM || '0'} วัน</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>ข้อมูลลูกค้า</Text>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาลูกค้า..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#94a3b8"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close-circle" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.resultCount}>
        แสดง {customerList.length} จาก {pagination.total || 0} รายการ
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#0ea5e9" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="people-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyText}>ไม่พบข้อมูลลูกค้า</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={customerList}
        renderItem={renderCustomer}
        keyExtractor={(item, index) => `${item.Code}-${index}`}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!isLoading && renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#0ea5e9"
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  resultCount: {
    fontSize: 14,
    color: '#64748b',
  },
  customerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerCode: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  customerDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
  },
});
