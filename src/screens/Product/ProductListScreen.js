// src/screens/Product/ProductListScreen.js
// 📦 Product List Screen

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
import { fetchProductList, setPage, setFilters } from '../../store/productSlice';
import { debounce } from '../../utils/helpers';

export default function ProductListScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const { 
    productList, 
    pagination, 
    filters, 
    isLoading 
  } = useSelector(state => state.product);

  const [searchText, setSearchText] = useState(filters.search);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Fetch products on mount and when filters change
  useEffect(() => {
    dispatch(fetchProductList({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      departCode: filters.departCode,
    }));
  }, [dispatch, pagination.page, filters.search, filters.departCode]);

  // ✅ Debounced search
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
    await dispatch(fetchProductList({
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

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.productHeader}>
        <Text style={styles.productCode}>{item.ItemCode}</Text>
        <View style={[styles.badge, getBadgeColor(item.DepartCode)]}>
          <Text style={styles.badgeText}>{item.DepartCode}</Text>
        </View>
      </View>
      
      <Text style={styles.productName} numberOfLines={2}>
        {item.Name || item.NameFG}
      </Text>
      
      <View style={styles.productFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>ต้นทุน</Text>
          <Text style={styles.price}>
            ฿{parseFloat(item.CostN || 0).toLocaleString()}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>ราคาขาย</Text>
          <Text style={styles.priceHighlight}>
            ฿{parseFloat(item.Price || 0).toLocaleString()}
          </Text>
        </View>
      </View>

      <Icon 
        name="chevron-forward" 
        size={20} 
        color="#94a3b8" 
        style={styles.chevron}
      />
    </TouchableOpacity>
  );

  const getBadgeColor = (departCode) => {
    const colors = {
      'RM': { backgroundColor: '#dbeafe', color: '#1e40af' },
      'TE': { backgroundColor: '#fce7f3', color: '#9f1239' },
      'SI': { backgroundColor: '#d1fae5', color: '#065f46' },
      'SF': { backgroundColor: '#fef3c7', color: '#92400e' },
    };
    return colors[departCode] || { backgroundColor: '#f1f5f9', color: '#475569' };
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>รายการสินค้า</Text>
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
        แสดง {productList.length} จาก {pagination.total || 0} รายการ
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
      <Icon name="cube-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyText}>ไม่พบสินค้า</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={productList}
        renderItem={renderProduct}
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
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 12,
    lineHeight: 22,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  priceHighlight: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  chevron: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
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
