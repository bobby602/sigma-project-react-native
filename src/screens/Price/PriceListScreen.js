// src/screens/Price/PriceListScreen.js
// 💰 Price List Screen with Inline Editing

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
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  fetchPriceList,
  setPage,
  setFilters,
  updatePrice,
  addPendingChange,
  clearPendingChanges,
} from '../../store/priceSlice';
import { debounce, formatCurrency } from '../../utils/helpers';

export default function PriceListScreen() {
  const dispatch = useDispatch();
  
  const { 
    priceList, 
    pagination, 
    filters, 
    pendingChanges,
    isLoading,
    isSaving,
  } = useSelector(state => state.price);

  const [searchText, setSearchText] = useState(filters.search);
  const [refreshing, setRefreshing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    dispatch(fetchPriceList({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      departCode: filters.departCode,
    }));
  }, [dispatch, pagination.page, filters.search, filters.departCode]);

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
    await dispatch(fetchPriceList({
      page: 1,
      limit: pagination.limit,
      search: filters.search,
      departCode: filters.departCode,
    }));
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoading && pagination.page < pagination.totalPages) {
      dispatch(setPage(pagination.page + 1));
    }
  };

  const handlePriceEdit = (item, field, value) => {
    const key = `${item.ItemCode}-${field}`;
    dispatch(addPendingChange({
      key,
      value: {
        ItemCode: item.ItemCode,
        field,
        value: parseFloat(value) || 0,
      },
    }));
  };

  const handleSavePrice = async (item) => {
    try {
      await dispatch(updatePrice({
        ItemCode: item.ItemCode,
        ...item,
      })).unwrap();
      
      Alert.alert('สำเร็จ', 'บันทึกราคาเรียบร้อยแล้ว');
      setEditingItem(null);
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถบันทึกราคาได้');
    }
  };

  const renderPrice = ({ item }) => {
    const isEditing = editingItem?.ItemCode === item.ItemCode;

    return (
      <View style={styles.priceCard}>
        <View style={styles.priceHeader}>
          <Text style={styles.priceCode}>{item.ItemCode}</Text>
          <TouchableOpacity
            onPress={() => setEditingItem(isEditing ? null : item)}
            style={styles.editButton}
          >
            <Icon 
              name={isEditing ? 'close' : 'create-outline'} 
              size={20} 
              color={isEditing ? '#ef4444' : '#0ea5e9'}
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.priceName} numberOfLines={2}>
          {item.Name || item.NameFG}
        </Text>

        <View style={styles.priceGrid}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>ราคาขาย</Text>
            {isEditing ? (
              <TextInput
                style={styles.priceInput}
                defaultValue={String(item.Price || 0)}
                keyboardType="numeric"
                onChangeText={(value) => handlePriceEdit(item, 'Price', value)}
              />
            ) : (
              <Text style={styles.priceValue}>
                ฿{formatCurrency(item.Price || 0)}
              </Text>
            )}
          </View>

          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>ต้นทุน</Text>
            {isEditing ? (
              <TextInput
                style={styles.priceInput}
                defaultValue={String(item.CostN || 0)}
                keyboardType="numeric"
                onChangeText={(value) => handlePriceEdit(item, 'CostN', value)}
              />
            ) : (
              <Text style={styles.priceValue}>
                ฿{formatCurrency(item.CostN || 0)}
              </Text>
            )}
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSavePrice(item)}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Icon name="checkmark" size={20} color="#ffffff" />
                <Text style={styles.saveButtonText}>บันทึก</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>บันทึกราคาสินค้า</Text>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาสินค้า..."
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
        แสดง {priceList.length} จาก {pagination.total || 0} รายการ
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
      <Icon name="pricetag-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyText}>ไม่พบข้อมูลราคา</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={priceList}
        renderItem={renderPrice}
        keyExtractor={(item, index) => `${item.ItemCode}-${index}`}
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
  priceCard: {
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
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  editButton: {
    padding: 4,
  },
  priceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 12,
    lineHeight: 22,
  },
  priceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceItem: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  priceInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
