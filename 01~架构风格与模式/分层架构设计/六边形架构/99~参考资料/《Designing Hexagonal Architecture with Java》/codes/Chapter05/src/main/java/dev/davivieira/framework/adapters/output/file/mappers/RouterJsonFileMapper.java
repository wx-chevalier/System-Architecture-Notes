package dev.davivieira.framework.adapters.output.file.mappers;

import dev.davivieira.domain.entity.Router;
import dev.davivieira.domain.entity.Switch;
import dev.davivieira.domain.vo.*;
import dev.davivieira.framework.adapters.output.file.json.*;

import java.util.List;
import java.util.stream.Collectors;

public class RouterJsonFileMapper {

    public static Router toDomain(RouterJson routerJson){
        var routerId = RouterId.withId(routerJson.getRouterId().toString());
        var routerType = RouterType.valueOf(routerJson.getRouterType().name());
        var switchId = SwitchId.withId(routerJson.getNetworkSwitch().getSwitchId().toString());
        var switchType = SwitchType.valueOf(routerJson.getNetworkSwitch().getSwitchType().toString());
        var ip = IP.fromAddress(routerJson.getNetworkSwitch().getIp().getAddress());
        var networks =  getNetworksFromJson(routerJson.getNetworkSwitch().getNetworks());

        var networkSwitch = new Switch(switchId, switchType, networks, ip);

        return new Router(routerType, routerId, networkSwitch);
    }

    public static RouterJson toJson(Router router){
        var routerId = router.getRouterId().getUUID();
        var routerTypeJson = RouterTypeJson.valueOf(router.getRouterType().toString());
        var switchIdJson = router.getNetworkSwitch().getSwitchId().getUUID();
        var switchTypeJson = SwitchTypeJson.valueOf(router.getNetworkSwitch().getSwitchType().toString());
        var ipJson = IPJson.fromAddress(router.getNetworkSwitch().getAddress().getIPAddress());
        var networkDataList = getNetworksFromDomain(router.retrieveNetworks());

        var switchJson = new SwitchJson(switchIdJson, ipJson, switchTypeJson, networkDataList);

        return new RouterJson(routerId, routerTypeJson, switchJson);
    }

    private static List<Network> getNetworksFromJson(List<NetworkJson> networkJson){
        return networkJson
                .stream()
                .map(json ->  new Network(
                        IP.fromAddress(json.getIp().getAddress()),
                        json.getNetworkName(),
                        Integer.valueOf(json.getCidr())))
                .collect(Collectors.toList());
    }

    private static List<NetworkJson>  getNetworksFromDomain(List<Network> networks){
        return networks
                .stream()
                .map(network -> new NetworkJson(
                        IPJson.fromAddress(network.getAddress().getIPAddress()),
                        network.getName(),
                        String.valueOf(network.getCidr())))
                .collect(Collectors.toList());
    }

}
